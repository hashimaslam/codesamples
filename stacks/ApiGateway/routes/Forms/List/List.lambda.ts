import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import {
  getFormFiltersFromEvent,
  getFormsFromOpensearch,
} from "../utils/Forms";
import { OS_MAX_PAGINATION_LIMIT } from "../../Audiences/utils/Audiences.types";
import { DEFAULT_PAGINATION } from "../../../../../shared/utils/Pagination";
import { LOCAL_URL } from "../../../../../shared/utils/Constants";
import { FORM_STATUS } from "../utils/Forms.types";
import { getPublicFixedURL } from "../../Storage/utils/Storage";

interface Request extends APIGatewayProxyEvent {}

export const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view Forms List.",
      })
    );
  }

  // sort params
  let sortParam = event.multiValueQueryStringParameters?.sortBy as [string];

  // pagination params
  let offset = Number(event.queryStringParameters?.offset as string);
  let limit = Number(event.queryStringParameters?.limit as string);

  const searchText = event.queryStringParameters?.search as string;

  const filters = getFormFiltersFromEvent(event);

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

  // Add default sort parameter
  if (!sortParam) {
    sortParam = ["createdAt.desc"];
  }

  const { data, absoluteCount, aggregations } = await getFormsFromOpensearch(
    offset,
    limit,
    team.teamId,
    searchText,
    filters,
    sortParam
  );

  await Promise.all(
    data.map(async (form) => {
      if (form.status === FORM_STATUS.PUBLISHED)
        form.form_url =
          (event.headers.origin as string) ??
          LOCAL_URL + "/audiences/form/" + form.id;
      if (form.logo_path) {
        form.logo_path = await getPublicFixedURL(form.logo_path);
      }
    })
  );

  return apiResponse(
    200,
    JSON.stringify({
      data,
      aggregations,
      count: data.length,
      absoluteCount,
      offset,
      limit,
    })
  );
};

export const handler = middlewares(ivplementation);
