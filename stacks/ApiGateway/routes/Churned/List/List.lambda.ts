import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { CHURNED_USERS_SORTABLE_FIELDS } from "../utils/Churned.types";
import { getSourceById } from "../../Sources/utils/Sources";
import { Pagination } from "../../../../../shared/utils/Pagination";
import {
  getAudiencesFromOpensearch,
  getFiltersFromEvent,
} from "../../Audiences/utils/Audiences";
import { SEGMENT_TYPE, Segment } from "../../Segments/utils/Segments.types";
import {
  getSegmentById,
  getSegmentMembers,
} from "../../Segments/utils/Segments";
import { AudienceFilters } from "../../Audiences/utils/Audiences.types";

export const ivpl = async (event: APIGatewayProxyEvent) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const sourceId = event.queryStringParameters?.sourceId as string;
  const sortBy = event.multiValueQueryStringParameters?.sortBy as
    | undefined
    | CHURNED_USERS_SORTABLE_FIELDS[];

  if (!sourceId) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Missing required parameter: sourceId" })
    );
  }

  const team = await getTeamOfUser(userId);
  const teamId = team.teamId;
  const source = await getSourceById(sourceId);

  const segment: Segment | undefined = event.queryStringParameters?.segment_id
    ? await getSegmentById(event.queryStringParameters?.segment_id)
    : undefined;

  const roleHasAccess =
    team.role == UserRole.ADMIN || team.role == UserRole.EDITOR;
  const usersTeamOwnsTheSource = source?.team_id == teamId;

  if (!roleHasAccess) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view Churned members",
      })
    );
  }

  if (!usersTeamOwnsTheSource) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "This source does not exist or is not belonging to your team",
      })
    );
  }

  const from = Pagination.getOffsetFromEvent(event);
  const size = Pagination.getSizeFromEvent(event);

  const filters = getFiltersFromEvent(event);

  const overwrittenBySegment = segment
    ? overrideRequestWithSegment({ filters, sortBy }, segment)
    : { filters, sortBy };

  if (segment?.type === SEGMENT_TYPE.SNAPSHOT) {
    segment.memberIds = (await getSegmentMembers(segment?.id)).map(
      (s) => s.id
    ) as string[];
  }

  const results = await getAudiencesFromOpensearch(
    overwrittenBySegment.filters,
    from,
    size ?? 10,
    overwrittenBySegment.sortBy,
    teamId,
    [],
    segment?.memberIds?.length ? segment.memberIds : [],
    true
  );

  return apiResponse(
    200,
    JSON.stringify({
      data: results.data,
      count: results.data.length,
      absoluteCount: results.absoluteCount,
      aggregations: results.aggregations,
    })
  );
};

function overrideRequestWithSegment(
  props: {
    filters: AudienceFilters;
    sortBy?: CHURNED_USERS_SORTABLE_FIELDS[];
  },
  segment: Segment
) {
  const { filters, sortBy } = props;

  if (segment?.filters?.sourceId?.length) {
    if (!filters.sourceId) {
      filters.sourceId = [];
    }
    filters.sourceId.push(...segment.filters.sourceId);
  }

  if (segment?.filters?.tags?.length) {
    if (!filters.tags) {
      filters.tags = [];
    }
    filters.tags.push(...segment.filters.tags);
  }

  if (segment.filters?.type?.length) {
    if (!filters.type) {
      filters.type = [];
    }
    filters.type.push(...segment.filters.type);
  }

  if (segment.filters?.searchText) {
    filters.searchText = segment.filters.searchText;
  }

  return {
    filters,
    sortBy: segment.filters?.sort ?? sortBy,
  };
}

export const handler: any = middlewares(ivpl);
