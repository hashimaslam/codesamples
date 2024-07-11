import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { DEFAULT_PAGINATION } from "../../../../../shared/utils/Pagination";
import { getSourcesDataFromOpensearch } from "../utils/Sources";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view Sources list.",
      })
    );
  }

  // search params
  const searchText = event.queryStringParameters?.search as string;

  // sort params
  let sortBy = event.multiValueQueryStringParameters?.sortBy as [string];

  // filters
  const chainId = event.multiValueQueryStringParameters?.chain_id as string[];
  const type = event.multiValueQueryStringParameters?.type as string[];
  const symbol = event.multiValueQueryStringParameters?.symbol as string[];

  // pagination details
  let offset = Number(event.queryStringParameters?.offset as string);
  let limit = Number(event.queryStringParameters?.limit as string);

  // Check for pagination params
  if (!offset || offset <= 0) {
    offset = 0;
  }

  if (!limit || limit > DEFAULT_PAGINATION || limit < 1) {
    limit = DEFAULT_PAGINATION;
  }

  // Add default sort parameter
  if (!sortBy) {
    sortBy = ["createdAt.desc"];
  }

  let { data, absoluteCount } = await getSourcesDataFromOpensearch(
    team.teamId,
    searchText,
    sortBy,
    { limit, offset, symbol, type, chainId }
  );

  return apiResponse(
    200,
    JSON.stringify({ data, absoluteCount, count: data.length })
  );
};

export const handler: any = middlewares(ivplementation);
