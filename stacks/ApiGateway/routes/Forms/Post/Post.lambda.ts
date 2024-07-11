import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { DATA_INGESTION_AVAILABLE_CHAINS } from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import {
  CONTRACT_TYPE,
  FORM_STATUS,
  SupportedRequiredFields,
} from "../utils/Forms.types";
import { Time } from "../../../../../shared/utils/DateTime";
import { isUniqueSourceName } from "../../Sources/utils/Sources";
import { storeFormInDB } from "../utils/Forms";

export interface TokenMinRequiredBalance {
  // Chain ID, see this for supported values: packages/infrastructure/lib/shared/utils/AudienceDataProviders/AudienceDataProviders.types.ts
  network: number;
  minRequired: number;
}

interface ContractMinRequiredBalance extends TokenMinRequiredBalance {
  address: string;
  contractType: CONTRACT_TYPE;
}

export interface Requirements {
  requiredFields: Array<SupportedRequiredFields>;
  minRequiredBalances: Array<
    ContractMinRequiredBalance | TokenMinRequiredBalance
  >;
}

export interface CreateFormProps {
  name: string;
  title: string;
  description: string;
  timeframe?: { start: number; end: number };
  ctaText: string;
  scheduledMessage: string;
  successMessage: string;
  maxMemberSize?: number;

  styling?: {
    /**
     * Relative path inside the temporary S3 bucket
     */
    logo?: string;

    outerBackground?: string;
    outerColor?: string;

    innerBackground?: string;
    innerColor?: string;

    ctaBackground?: string;
    ctaColor?: string;
  };

  requirements?: Requirements;
}

interface Request extends Omit<APIGatewayProxyEvent, "body"> {
  body: CreateFormProps;
}

export const ivplementation = async (event: Request) => {
  const idUser = event.requestContext.authorizer?.claims.sub;
  const team = await getTeamOfUser(idUser);
  const idTeam = team.teamId;

  if (team.role !== UserRole.ADMIN) {
    return apiResponse(403, "You are not allowed to create a form");
  }

  const {
    name,
    title,
    description,
    scheduledMessage,
    successMessage,
    timeframe,
    ctaText,
    maxMemberSize,
    styling,
    requirements,
  } = event.body;

  const isPublished = event.queryStringParameters?.isPublished as string;
  let isFormPublished = false;

  try {
    isFormPublished = JSON.parse(isPublished);
  } catch (err) {}

  const requiredFields: (keyof Request["body"])[] = [
    "name",
    "title",
    "description",
    "successMessage",
    "ctaText",
  ];

  for (let requiredField of requiredFields) {
    if (!event.body[requiredField]) {
      return apiResponse(
        400,
        JSON.stringify({ error: `${requiredField} is required` })
      );
    }
  }

  // `scheduledMessage` is only required when the form has a starting date set
  if (timeframe?.start && !scheduledMessage) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `scheduledMessage is required, when form has a start date`,
      })
    );
  }

  const start = event.body.timeframe?.start;
  const end = event.body.timeframe?.end;

  if (end && end < Time.now()) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "If provided, 'timeframe.end' must be in the future",
      })
    );
  }

  if (start && end && start >= end) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "If provided, 'timeframe.start' must be < 'timeframe.end",
      })
    );
  }

  if (requirements?.requiredFields.length) {
    const allowedRequiredFields: SupportedRequiredFields[] = [
      "email",
      "captcha",
    ];

    const invalidRequiredFields = requirements.requiredFields.filter(
      (requiredField) => !allowedRequiredFields.includes(requiredField)
    );

    if (invalidRequiredFields.length) {
      return apiResponse(
        400,
        JSON.stringify({
          error: `Invalid required fields: ${invalidRequiredFields.join(", ")}`,
        })
      );
    }
  }

  if (requirements?.minRequiredBalances) {
    const invalidNetworks = requirements.minRequiredBalances
      .filter(
        (minRequiredBalance) =>
          !DATA_INGESTION_AVAILABLE_CHAINS.includes(minRequiredBalance.network)
      )
      .map((x) => x.network);

    if (invalidNetworks.length) {
      return apiResponse(
        400,
        JSON.stringify({
          error: `Invalid networks: ${invalidNetworks.join(
            ", "
          )}. Available networks: ${DATA_INGESTION_AVAILABLE_CHAINS.join(
            ", "
          )}`,
        })
      );
    }
  }

  if (isFormPublished) {
    if (!(await isUniqueSourceName(team.teamId, name)))
      return apiResponse(
        400,
        JSON.stringify({
          error: `Duplicate name. Source name with "${name}" is already present`,
        })
      );
  }

  const createdForm = await storeFormInDB(
    {
      name,
      title,
      description,
      scheduledMessage,
      successMessage,
      timeframe,
      ctaText,
      maxMemberSize,
      styling,
      requirements,
    },
    idUser,
    idTeam,
    isFormPublished ? FORM_STATUS.PUBLISHED : FORM_STATUS.DRAFT
  );

  if (!createdForm.success) {
    return apiResponse(400, JSON.stringify({ error: createdForm.error }));
  }

  return apiResponse(
    200,
    JSON.stringify({ id: createdForm.id, source_id: createdForm.sourceId })
  );
};

export const handler: any = middlewares(ivplementation);
