import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { deleteAllowListFromDB, getAllowListById } from "../utils/AllowLists";

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
  const { id } = event.pathParameters;

  const [team, allowlist] = await Promise.all([
    getTeamOfUser(userId),
    getAllowListById(id),
  ]);

  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin. You cannot delete allowlists",
      })
    );
  }

  if (!allowlist || allowlist.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This allowlist does not exist or it is not managed by your team",
      })
    );
  }

  if (allowlist.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({ error: "This allow list is not managed by your team" })
    );
  }

  if (allowlist.collection_id && allowlist.collection_id !== "") {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This allow list is ACTIVE, can't be deleted",
      })
    );
  }

  if (await deleteAllowListFromDB(id)) {
    return apiResponse(200, JSON.stringify({ success: true }));
  }

  return apiResponse(400, JSON.stringify({ success: false }));
};

export const handler: any = middlewares(ivplementation);
