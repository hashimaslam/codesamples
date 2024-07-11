import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { OpenSearchClient } from "../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { getSourceById } from "../../Sources/utils/Sources";

interface Request extends APIGatewayProxyEvent {}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  let items = event.multiValueQueryStringParameters?.items as string[];

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot view notes.",
      })
    );
  }

  let result: any = { data: {} };

  const itemsSupported = ["tags", "sources", "type"];
  let itr = 0;

  if (!items) {
    items = itemsSupported;
  }

  await Promise.all(
    items.map(async (item) => {
      if (itemsSupported.indexOf(item) >= 0) {
        const data = await getItems(
          item.localeCompare("sources") == 0 ? "source_ids" : item,
          team.teamId
        );
        result.data[item] = data.data;
        itr += 1;

        if (item.localeCompare("sources") == 0) {
          let count = 0;
          await Promise.all(
            result.data[item].map(async (ele: any) => {
              const source = await getSourceById(ele.key);
              ele.value = source?.source_name;
              result.data[item][count] = ele;
              count += 1;
            })
          );
        }
      }
    })
  );

  return apiResponse(200, JSON.stringify(result));
};

export async function getItems(itemName: string, teamId: string) {
  let body: any = {
    size: 1,
    query: {
      bool: {
        must: [{ match_all: {} }],
        filter: [
          {
            term: {
              "team_id.keyword": `${teamId}`,
            },
          },
        ],
      },
    },
    aggs: {
      composite: {
        terms: {
          field: `${itemName}.keyword`,
        },
      },
    },
  };

  console.debug("Opensearch Query on Items --------", JSON.stringify(body));

  const os = await OpenSearchClient.getInstance();
  const result = await os.search({
    index: (await TableNames.audiences()).toLowerCase(),
    body,
  });

  return {
    data: result.body.aggregations.composite.buckets,
  };
}

export const handler: any = middlewares(ivplementation);
