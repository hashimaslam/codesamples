import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";

import { fetchData, getSegmentById } from "../../Segments/utils/Segments";
import { Segment } from "../../Segments/utils/Segments.types";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import {
  getAudiencesFromOpensearch,
  getFiltersFromEvent,
} from "../utils/Audiences";
import { OS_MAX_PAGINATION_LIMIT } from "../utils/Audiences.types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DEFAULT_PAGINATION } from "../../../../../shared/utils/Pagination";

interface Request extends APIGatewayProxyEvent {}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  // sort params
  let sortParam = event.multiValueQueryStringParameters?.sortBy as [string];

  // filter params
  const sourceId = event.multiValueQueryStringParameters?.source;
  const typeParam = event.multiValueQueryStringParameters?.type;
  const tagsParam = event.multiValueQueryStringParameters?.tags;

  // pagination params
  let offset = Number(event.queryStringParameters?.offset as string);
  let limit = Number(event.queryStringParameters?.limit as string);
  const searchText = event.queryStringParameters?.search as string;

  // fetch segment related information
  const segmentId = event.queryStringParameters?.segment_id as string;
  const totalCount = Number(event.queryStringParameters?.totalCount);

  const team = await getTeamOfUser(userId);

  if (team.role != UserRole.ADMIN && team.role != UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view Audiences List",
      })
    );
  }

  // Add default sort parameter
  if (!sortParam) {
    sortParam = ["createdAt.desc"];
  }

  if (segmentId) {
    let segData: Segment | undefined = await getSegmentById(segmentId);

    if (segData) {
      let { data, absoluteCount, aggregations } = await fetchData(
        segData,
        {
          type: typeParam,
          sort: sortParam,
          tags: tagsParam,
          totalCount,
          searchText,
          sourceId,
        },
        offset,
        limit
      );

      return apiResponse(
        200,
        JSON.stringify({
          data,
          count: data.length,
          absoluteCount,
          aggregations,
        })
      );
    }

    return apiResponse(200, JSON.stringify({ data: segData }));
  }

  // Check for pagination params
  if (!offset || offset <= 0) {
    offset = 0;
  }

  if (!limit || limit < 1) {
    limit = DEFAULT_PAGINATION;
  }

  if (limit > OS_MAX_PAGINATION_LIMIT) {
    limit = OS_MAX_PAGINATION_LIMIT;
  }

  //Parse filters
  const filters = getFiltersFromEvent(event);

  // Before we cumulate and sort, lets filter
  let { data, absoluteCount, aggregations } = await getAudiencesFromOpensearch(
    filters,
    offset,
    limit,
    sortParam,
    team.teamId,
    [],
    []
  );

  return apiResponse(
    200,
    JSON.stringify({
      data: data,
      count: data.length,
      absoluteCount: absoluteCount,
      aggregations,
      offset: offset,
      limit: limit,
    })
  );
};

export const handler: any = middlewares(ivplementation);
