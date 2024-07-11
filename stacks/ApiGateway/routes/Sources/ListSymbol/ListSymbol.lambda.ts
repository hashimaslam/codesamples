import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { OS_MAX_PAGINATION_LIMIT } from "../../Audiences/utils/Audiences.types";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { Source } from "../utils/Sources.types";
import { OpenSearchClient } from "../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { getLogger } from "../../../../../shared/utils/middlewares/getLogger";

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

  let symbols: string[] = [];

  const { data } = await getSymbolsFromSource(team.teamId);

  data.forEach((ele) => {
    if (ele.symbol) symbols.push(ele.symbol);
  });

  return apiResponse(
    200,
    JSON.stringify({
      symbols,
    })
  );
};

export async function getSymbolsFromSource(
  teamId: string
): Promise<{ data: Source[] }> {
  let body: any = {
    track_total_hits: true,
    size: OS_MAX_PAGINATION_LIMIT,
    _source: ["symbol"],
    collapse: {
      field: "symbol.keyword",
    },
    query: {
      bool: {
        filter: [
          {
            term: {
              "team_id.keyword": teamId,
            },
          },
        ],
      },
    },
  };

  try {
    const os = await OpenSearchClient.getInstance();
    const index = (await TableNames.sources()).toLowerCase();

    console.debug(
      `GET ${index}/_search `,
      JSON.stringify(body /*, null, "\t"*/)
    );

    const result = await os.search({ index, body });

    return {
      data: result.body.hits.hits.map((x: any) => x._source),
    };
  } catch (err: any) {
    getLogger().error(err);
    return { data: [] };
  }
}

export const handler: any = middlewares(ivplementation);
