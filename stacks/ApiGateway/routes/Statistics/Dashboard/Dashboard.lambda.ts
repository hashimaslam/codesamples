import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import {
  getUsersByIds,
  getUsersByTeam,
  getTeamOfUser,
  UserStatus,
} from "../../Users/utils/Users";
import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../shared/utils/TableNames";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
}

interface Response {
  collection_count: number;
  token_count: number;
  tevplate_count: number;
  user_count: number;
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const { teamId } = await getTeamOfUser(userId);

  const myTeammates = await getUsersByTeam(teamId);
  const userIdsArray = myTeammates.map((x) => x.member_id);

  const [collectionCount, tokenCount, tevplateCount, activeUserCount] =
    await Promise.all([
      getCountForTable(await TableNames.collections(), teamId, "team_id"),
      getCountForTable(await TableNames.tokens(), teamId, "team_id"),
      getCountForTable(await TableNames.tevplates(), teamId, "team_id"),
      (
        await getUsersByIds(userIdsArray)
      ).filter((u) => u.status === UserStatus.ACTIVE).length,
    ]);

  const response: Response = {
    collection_count: collectionCount,
    token_count: tokenCount,
    tevplate_count: tevplateCount,
    user_count: activeUserCount,
  };

  return apiResponse(200, JSON.stringify(response));
};

async function getCountForTable(
  tableName: string,
  teamId: string,
  indexName?: string
) {
  const results = await new DynamoDB()
    .query({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: "team_id = :team_id",
      ExpressionAttributeValues: {
        ":team_id": {
          S: teamId,
        },
      },
      Select: "COUNT",
    })
    .promise();
  if (results.$response.error || !results.Count) {
    console.error(results.$response.error);
    return 0;
  }
  return results.Count;
}

export const handler: any = middlewares(ivplementation);
