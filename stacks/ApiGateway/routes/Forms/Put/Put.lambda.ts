import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { DATA_INGESTION_AVAILABLE_CHAINS } from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { FORM_STATUS, SupportedRequiredFields } from "../utils/Forms.types";
import { Time } from "../../../../../shared/utils/DateTime";
import {
  getFormFromDynamoDB,
  getLogoPath,
  updateFormInDb,
} from "../utils/Forms";
import { Requirements } from "../Post/Post.lambda";

export interface UpdateFormProps {
  name: string;
  title: string;
  description: string;
  timeframe?: { start: number; end: number };
  ctaText: string;
  scheduledMessage: string;
  successMessage: string;
  maxMemberSize?: number;

  status: FORM_STATUS;

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
  body: UpdateFormProps;
}

export const ivplementation = async (event: Request) => {
  const idUser = event.requestContext.authorizer?.claims.sub;
  const team = await getTeamOfUser(idUser);
  const idTeam = team.teamId;
  const id = event.pathParameters?.id as string;

  const form = await getFormFromDynamoDB(id);

  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      403,
      JSON.stringify({ error: "Your role does not allow updating forms" })
    );
  }

  if (!form || form.id_team !== idTeam) {
    return apiResponse(404, JSON.stringify({ error: "Form not found" }));
  }

  form.title = event.body.title ?? form.title;
  form.description = event.body.description ?? form.description;
  form.cta_text = event.body.ctaText ?? form.cta_text;
  form.success_message = event.body.successMessage ?? form.success_message;
  form.max_member_size = event.body.maxMemberSize ?? form.max_member_size;

  form.cta_background =
    event.body.styling?.ctaBackground ?? form.cta_background;
  form.cta_color = event.body.styling?.ctaColor ?? form.cta_color;

  form.inner_background =
    event.body.styling?.innerBackground ?? form.inner_background;
  form.inner_color = event.body.styling?.innerColor ?? form.inner_color;

  form.outer_background =
    event.body.styling?.outerBackground ?? form.outer_background;
  form.outer_color = event.body.styling?.outerColor ?? form.outer_color;

  form.scheduled_message =
    event.body.scheduledMessage ?? form.scheduled_message;

  form.start = event.body.timeframe?.start ?? form.start;
  form.end = event.body.timeframe?.end ?? form.end;

  form.name = event.body.name ?? form.name;
  form.requirements = event.body.requirements ?? form.requirements;
  form.status = event.body.status ?? form.status;

  form.logo_path = event.body.styling?.logo
    ? await getLogoPath(id, event.body.styling.logo)
    : form.logo_path;

  // Step 1: Run validations - the merged entity between user input to API and DB object,
  // need to result in an entity that passes all validations, and is ready for storing back to DB
  if (form.start && !form.scheduled_message) {
    // `scheduledMessage` is only required when the form has a starting date set
    return apiResponse(
      400,
      JSON.stringify({
        error: `scheduledMessage is required, when form has a start date`,
      })
    );
  }

  if (event.body.timeframe?.end && event.body.timeframe?.end < Time.now()) {
    // Warning, do not validate the DB "end" timestamp. Only validate the user input, if present.
    // This is because the DB object might have an end date in the past (an expired form),
    // which is totally okay and expected. The user should be able to still update other attributes of the form
    // without triggering this error
    return apiResponse(
      400,
      JSON.stringify({
        error: "If provided, 'timeframe.end' must be in the future",
      })
    );
  }

  if (form.start && form.end && form.start > form.end) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "If provided, 'timeframe.start' must be < 'timeframe.end",
      })
    );
  }

  if (form.requirements?.minRequiredBalances) {
    const invalidNetworks = form.requirements?.minRequiredBalances
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

  // Step 3: Overwrite form object in DB
  // Potentially, zero or more fields were overwritten above
  await updateFormInDb(id, form);

  return apiResponse(200, JSON.stringify({ id, form }));
};

export const handler = middlewares(ivplementation);
