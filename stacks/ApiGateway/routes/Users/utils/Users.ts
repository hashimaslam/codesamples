import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { UserTeam } from "../../../../../shared/utils/UserTeam";
import Stripe from "stripe";
import { Time } from "../../../../../shared/utils/DateTime";

export const enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export const enum UserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  DELETED = "deleted",
  DEACTIVATED = "deactivated",
}

export const supportedRoles = [
  UserRole.ADMIN,
  UserRole.EDITOR,
  UserRole.VIEWER,
];

export type TeamMembership = {
  member_id: string;
  role: UserRole;
};

type TeamMember = {
  teamId: string;
  role: UserRole;
};

export type Team = {
  id: string;
};

export const getUser = async (id: string) => {
  const item = await new DynamoDB()
    .getItem({
      TableName: await TableNames.users(),
      Key: DynamoDB.Converter.marshall({ id }),
    })
    .promise();
  if (!item.Item) {
    console.error(
      `User not found in the users table. This is a sign of the DynamoDB tables being out of sync, which indicates manual database manipulation`
    );
    throw new Error(`User not found in the users table`);
  }
  const unmarshalled = DynamoDB.Converter.unmarshall(item.Item);

  return {
    id: unmarshalled.id,
    status: unmarshalled.status,
    email: unmarshalled.email,
    role: unmarshalled.role,
    wallet_address: unmarshalled.wallet_address,
    deleted_at: unmarshalled.deleted_at,
  };
};

export async function updateUserField(
  id: string,
  field: string,
  value: string
) {
  const updateResult = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.users(),
      Key: DynamoDB.Converter.marshall({ id }),
      UpdateExpression: `set #f = :v`,
      ExpressionAttributeNames: {
        "#f": field,
      },
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":v": value,
      }),
    })
    .promise();

  if (updateResult.$response.error) {
    console.error(updateResult.$response.error);
    throw new Error(updateResult.$response.error.message);
  }

  return true;
}

export async function deleteUserFromDynamoDB(id: string) {
  const item = await new DynamoDB()
    .deleteItem({
      TableName: await TableNames.users(),
      Key: DynamoDB.Converter.marshall({ id }),
    })
    .promise();
  if (item.$response.error) {
    console.error(item.$response.error);
    throw new Error(`Failed to delete a user from DynamoDB`);
  }
  return true;
}

export async function softDeleteUserInDynamoDB(id: string) {
  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.users(),
      Key: DynamoDB.Converter.marshall({ id }),
      UpdateExpression: `set #deleted_at = :deleted_at`,
      ExpressionAttributeNames: {
        "#deleted_at": "deleted_at",
      },
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":deleted_at": Time.now(),
      }),
    })
    .promise();
  if (result.$response.error) {
    console.error(result.$response.error);
    throw new Error(`Failed to soft delete user in DynamoDB`);
  }
  return true;
}

/**
 * Delete all DynamoDB records which keep relationship of the provided user ID with any teams
 */
export async function deleteUserMemberships(id: string) {
  const teamMemberships = await UserTeam.getTeamsOfUser(id);
  for (let membership of teamMemberships) {
    await new DynamoDB()
      .deleteItem({
        TableName: await TableNames.teamMembers(),
        Key: DynamoDB.Converter.marshall({
          member_id: id,
          team_id: membership.teamId,
        }),
      })
      .promise();
  }
}

/**
 * Get the team of which the provided user is belonging to a role
 */
export async function getManagedTeam(userId: string, role: string) {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.teamMembers(),
      IndexName: "member_id",
      KeyConditionExpression: "member_id=:member_id",
      ExpressionAttributeValues: {
        ":member_id": {
          S: userId,
        },
      },
    })
    .promise();

  const team = results.Items?.map((x) => DynamoDB.Converter.unmarshall(x))
    .filter((x) => x.role === role)
    .find(() => true);

  if (!team) {
    return;
  }
  const teamId = team.teamId;

  const item = await new DynamoDB()
    .getItem({
      TableName: await TableNames.teams(),
      Key: DynamoDB.Converter.marshall({
        id: teamId,
      }),
    })
    .promise();

  if (!item.Item) {
    throw new Error(
      `Found a team relationship but the corresponding team was not found in DynamoDB`
    );
  }

  return DynamoDB.Converter.unmarshall(item.Item) as {
    id: string;
  };
}

export async function getUsersByTeam(
  teamId: string
): Promise<ReadonlyArray<TeamMembership>> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.teamMembers(),
      KeyConditionExpression: "team_id=:team_id",
      ExpressionAttributeValues: {
        ":team_id": {
          S: teamId,
        },
      },
    })
    .promise();

  if (!results.Items) {
    return [];
  }
  return results.Items.map((x) => DynamoDB.Converter.unmarshall(x)).map(
    (x) =>
      ({
        member_id: x.member_id,
        role: x.role,
        // @TODO enrich with firstname, lastname, avatar image, etc
      } as TeamMembership)
  );
}

export async function getTeamData(teamId: string): Promise<Team> {
  const item = await new DynamoDB()
    .getItem({
      TableName: await TableNames.teams(),
      Key: DynamoDB.Converter.marshall({
        id: teamId,
      }),
    })
    .promise();

  if (!item.Item) {
    throw new Error(
      `Found a team relationship but the corresponding team was not found in DynamoDB`
    );
  }

  return DynamoDB.Converter.unmarshall(item.Item) as {
    id: string;
    stripe_pk: string;
    stripe_sk: string;
    stripe_webhook: Stripe.WebhookEndpoint;
  };
}

export async function getTeamOfUser(id: string): Promise<TeamMember> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.teamMembers(),
      IndexName: "member_id",
      KeyConditionExpression: "member_id=:member_id",
      ExpressionAttributeValues: {
        ":member_id": {
          S: id,
        },
      },
    })
    .promise();

  // @TODO Maybe support multiple team memberships in the future?
  const firstRow = results.Items?.map((x) =>
    DynamoDB.Converter.unmarshall(x)
  ).find(() => true);

  if (!firstRow) {
    throw new Error(`User not found in team members`);
  }

  const teamId = firstRow.team_id;
  const role = firstRow.role;

  if (!(await isValidTeam(teamId))) {
    throw new Error(`Team is not valid`);
  }

  return {
    teamId,
    role,
  };
}

export async function updateTeamData(team: any) {
  let updateExpression = "set";
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};
  for (const property in team) {
    if (property === "id") continue;
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = team[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.teams(),
      Key: DynamoDB.Converter.marshall({
        id: team.id,
      }),
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: DynamoDB.Converter.marshall(
        ExpressionAttributeValues
      ),
      ReturnValues: "UPDATED_NEW",
    })
    .promise();

  if (result.$response.error) {
    console.error(result.$response.error);
    throw new Error(result.$response.error.message);
  }

  return {
    id: team.id,
    updated_attributes: result.Attributes
      ? DynamoDB.Converter.unmarshall(result.Attributes)
      : {},
  };
}

async function isValidTeam(id: string) {
  const item = await new DynamoDB()
    .getItem({
      TableName: await TableNames.teams(),
      Key: DynamoDB.Converter.marshall({
        id,
      }),
    })
    .promise();

  return !!item.Item;
}

export async function getUsersByIds(userIds: string[]) {
  const tableName = await TableNames.users();
  const dynamodb = new DynamoDB();

  const aggregator = [];

  const chunkSize = 25;
  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunkOfIds = userIds.slice(i, i + chunkSize);

    const results = await dynamodb
      .batchGetItem({
        RequestItems: {
          [tableName]: {
            Keys: chunkOfIds.map((x) => DynamoDB.Converter.marshall({ id: x })),
          },
        },
      })
      .promise();

    if (!results.Responses) {
      continue;
    }

    const parts = results.Responses[tableName]
      .map((x) => DynamoDB.Converter.unmarshall(x))
      .map((user) => {
        const status =
          user.deleted_at && user.deleted_at > 0 ? "deleted" : user.status;
        return {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          wallet_address: user.wallet_address,
          status,
          created_at: user.created_at,
          updated_at: user.updated_at,
          deleted_at: user.deleted_at,
        };
      });

    aggregator.push(...parts);
  }
  return aggregator;
}

export async function getRole(id: string) {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.teamMembers(),
      IndexName: "member_id",
      KeyConditionExpression: "member_id=:member_id",
      ExpressionAttributeValues: {
        ":member_id": {
          S: id,
        },
      },
    })
    .promise();

  const role = results.Items?.map((x) => DynamoDB.Converter.unmarshall(x)).find(
    () => true
  )?.role;

  return role as string;
}
