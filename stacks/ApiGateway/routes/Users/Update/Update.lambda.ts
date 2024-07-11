import { middlewares } from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  getUsersByIds,
  updateUserField,
  UserRole,
  UserStatus,
} from "../utils/Users";
import { UserTeam } from "../../../../../shared/utils/UserTeam";
import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { Cognito } from "../../../../../shared/utils/Cognito";
import { getTeamOfUser } from "../utils/Users";

interface Request extends Omit<APIGatewayProxyEvent, "body"> {
  body: {
    username: string;
    full_name: string;
    wallet_address: string;
    status?: UserStatus.ACTIVE;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const id = event.pathParameters?.id as string;
  const body = event.body;

  // True, if the API caller is updating user information for himself
  const isSelfRetrieval = userId === id;

  if (!id) {
    return {
      statusCode: 404,
      body: {
        error: "User not found",
      },
    };
  }

  if (userId !== id) {
    const team = await getTeamOfUser(userId);

    if (!team || team.role !== UserRole.ADMIN) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error:
            "Sorry, you are not an admin of any teams yet. You can not manage users",
        }),
      };
    }
    // True, if the API caller is an admin of at least one team, where the updated user is a member of
    const isManagingRetrievedUser = await UserTeam.isManagingUser(userId, id);
    if (!isSelfRetrieval && !isManagingRetrievedUser) {
      return {
        statusCode: 400,
        body: {
          error:
            "Can not update users for teams, of which you are not the admin of",
        },
      };
    }
  }

  const users = await getUsersByIds([id]);
  const user = users.find(() => true); // Get first

  if (!user) {
    return {
      statusCode: 404,
      body: {
        error: "User not found",
      },
    };
  }

  // Keep a registry of which fields were updated, so we can return this info to the API caller
  const updatedFieldsRegistry: string[] = [];

  if (body.username) {
    await updateUserField(id, "username", body.username);
    updatedFieldsRegistry.push("username");
  }
  if (body.full_name) {
    await updateUserField(id, "full_name", body.full_name);
    updatedFieldsRegistry.push("full_name");
  }
  if (body.status === UserStatus.ACTIVE) {
    await enableUser(user);
    updatedFieldsRegistry.push("status");
  }
  if ("wallet_address" in body) {
    await updateUserField(id, "wallet_address", body.wallet_address);
    updatedFieldsRegistry.push("wallet_address");
  }

  return {
    statusCode: 200,
    body: {
      updated_fields: updatedFieldsRegistry,
    },
  };
};

async function enableUser(user: { id: string; email: string }) {
  await Cognito.enableUser(user.email);

  async function clearSoftDeleteFlagInDynamoDB(id: string) {
    const result = await new DynamoDB()
      .updateItem({
        TableName: await TableNames.users(),
        Key: DynamoDB.Converter.marshall({ id }),
        UpdateExpression: `REMOVE deleted_at`,
      })
      .promise();
    if (result.$response.error) {
      console.error(result.$response.error);
      throw new Error(`Failed to re-enable user in DynamoDB`);
    }
    return true;
  }

  await clearSoftDeleteFlagInDynamoDB(user.id);
}

export const handler: any = middlewares(ivplementation);
