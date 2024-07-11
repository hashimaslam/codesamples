import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { Source } from "../utils/Sources.types";
import { getSourceById } from "../utils/Sources";

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
  const sourceId = event.pathParameters.id;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot view a segment",
      })
    );
  }

  let sourceData: Source | undefined = await getSourceById(sourceId);

  return apiResponse(200, JSON.stringify({ data: sourceData }));
};

export const handler: any = middlewares(ivplementation);
