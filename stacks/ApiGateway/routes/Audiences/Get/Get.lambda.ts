import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { getAudienceById } from "../utils/Audiences";
import { Audience } from "../utils/Audiences.types";
import { ingestAudienceAddress } from "../../../../../shared/utils/AudienceDataProviders/Covalenthq.Ingester";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };

  pathParameters: {
    id: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const team = await getTeamOfUser(userId);
  const audience_id = event.pathParameters.id;
  const ingest = event.queryStringParameters?.ingest;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view an audience member.",
      })
    );
  }

  let audience: Audience | undefined = await getAudienceById(audience_id);

  if (!audience || audience.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This audience does not exist or it is not managed by your team",
      })
    );
  }

  let iErrors: string[] = [];
  if (ingest) {
    //Ingest updated audience data
    iErrors = await ingestAudienceAddress("0000", audience_id);
  }

  return apiResponse(
    200,
    JSON.stringify({
      data: audience,
      errors: iErrors.length > 0 ? iErrors : undefined,
    })
  );
};

export const handler: any = middlewares(ivplementation);
