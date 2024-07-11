import { TableNames } from "../../../shared/utils/TableNames";
import { Cognito } from "../../../shared/utils/Cognito";
import {
  DeleteItemCommand,
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamodb = new DynamoDBClient();
const cognito = new CognitoIdentityProviderClient();

export const handler = async (event: { team_id: string }) => {
  if (!event.team_id) {
    throw new Error("team_id is required parameter in the payload");
  }
  const teamId = event.team_id;

  console.log(`Purging team ${teamId}`);

  const memberIds = await getTeamMemberIds(teamId);

  console.log("Team members resolved to:", memberIds);

  await purgeTeamRecords(teamId, await TableNames.tokens());
  await purgeTeamRecords(teamId, await TableNames.walletcollections());
  await purgeTeamRecords(teamId, await TableNames.tevplates());
  await purgeTeamRecords(teamId, await TableNames.collections());
  await purgeTeamRecords(teamId, await TableNames.audiences());

  await purgeUsersTable(memberIds);
  await purgeCognitoUsers(memberIds);

  await purgeTeamMembersTable(teamId);
  await purgeTeamsTable(teamId);

  console.log("Purging team covpleted");
};

const getTeamMemberIds = async (teamId: string) => {
  const results = await dynamodb.send(
    new ScanCommand({
      TableName: await TableNames.teamMembers(),
    })
  );

  return (
    results.Items?.map((x) => unmarshall(x))
      .filter((x) => x.team_id === teamId)
      .map((x) => x.member_id as string) ?? []
  );
};

async function purgeCognitoUsers(cognitoSubsArr: string[]) {
  const UserPoolId = await Cognito.getUserPoolId();

  for (const sub of cognitoSubsArr) {
    // Resolve Cognito username, providing a Cognito "sub" (UUID), because users can't be deleted by UUID
    const results = await cognito.send(
      new ListUsersCommand({
        Filter: `sub = "${sub}"`,
        UserPoolId,
      })
    );

    if (!results.Users?.length) {
      console.log(
        `${sub} seems to be previously deleted from Cognito user pool ${UserPoolId}. Skipping`
      );
      continue;
    }

    const Username = results.Users.find(() => true)?.Username as string;

    await cognito.send(
      new AdminDeleteUserCommand({
        UserPoolId,
        Username,
      })
    );
    console.log(`${sub} deleted from Cognito user pool ${UserPoolId}`);
  }
}

async function purgeUsersTable(memberIds: string[]) {
  const TableName = await TableNames.users();
  for (const pk of memberIds) {
    await dynamodb.send(
      new DeleteItemCommand({
        TableName,
        Key: {
          id: {
            S: pk,
          },
        },
      })
    );
    console.log(`id=${pk} deleted from DynamoDB table ${TableName}`);
  }
}

export async function purgeTeamRecords(teamId: string, tableName: string) {
  const records = await dynamodb.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "team_id",
      KeyConditionExpression: "team_id = :team_id",
      ExpressionAttributeValues: {
        ":team_id": {
          S: teamId,
        },
      },
    })
  );

  const ids = records.Items?.map((x) => unmarshall(x)).map((x) => x.id) ?? [];

  console.log(`IDs from table ${tableName} resolved to be deleted:`, ids);

  for (const id of ids) {
    await dynamodb.send(
      new DeleteItemCommand({
        TableName: tableName,
        Key: {
          id: {
            S: id,
          },
        },
      })
    );
    console.log(`id=${id} deleted from table ${tableName}`);
  }
}

async function purgeTeamMembersTable(teamId: string) {
  const TableName = await TableNames.teamMembers();
  const records = await dynamodb.send(
    new ScanCommand({
      TableName,
    })
  );

  const compositePKs =
    records.Items?.map((x) => unmarshall(x))
      .filter((x) => (x.team_id = teamId))
      .map((x) => ({
        team_id: x.team_id,
        member_id: x.member_id,
      })) ?? [];

  console.log(
    `IDs from table ${TableName} resolved to be deleted:`,
    compositePKs
  );

  for (let pk of compositePKs) {
    await dynamodb.send(
      new DeleteItemCommand({
        TableName,
        Key: {
          team_id: {
            S: pk.team_id,
          },
          member_id: {
            S: pk.member_id,
          },
        },
      })
    );
    console.log(
      `team_id=${pk.team_id},member_id=${pk.member_id} deleted from table ${TableName}`
    );
  }
}

async function purgeTeamsTable(id: string) {
  const TableName = await TableNames.teams();
  await dynamodb.send(
    new DeleteItemCommand({
      TableName,
      Key: {
        id: {
          S: id,
        },
      },
    })
  );
}
