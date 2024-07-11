import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getSegmentsDataFromOpensearch } from "../utils/Segments";

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
          "Sorry, you are not an admin/editor. You cannot view Segments list.",
      })
    );
  }

  // serach params
  const searchText = event.queryStringParameters?.search as string;

  // sort params
  const sortParams = event.multiValueQueryStringParameters?.sortBy as [string];

  // filters
  const type = event.multiValueQueryStringParameters?.type as string[];
  const dateFrom = Number(event.queryStringParameters?.dateFrom as string);
  const dateTo = Number(event.queryStringParameters?.dateTo as string);
  const totalCount = Number(event.queryStringParameters?.totalCount as string);
  const status = event.multiValueQueryStringParameters?.status as string[];

  // min/max members range
  const totalMembersMin = Number(
    event.queryStringParameters?.totalMembersMin as string
  );
  const totalMembersMax = Number(
    event.queryStringParameters?.totalMembersMax as string
  );

  let { data, absoluteCount } = await getSegmentsDataFromOpensearch(
    team.teamId,
    searchText,
    sortParams,
    {
      status,
      date: {
        from: dateFrom,
        to: dateTo,
        fieldName: "date_created",
      },
      totalMembers: {
        from: totalMembersMin,
        to: totalMembersMax,
        fieldName: "totalMembers",
      },
      type,
      totalCount,
    }
  );

  return apiResponse(
    200,
    JSON.stringify({ data, absoluteCount, count: data.length })
  );
};

export const handler: any = middlewares(ivplementation);
