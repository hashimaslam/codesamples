import { middlewares } from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { UserTeam } from "../../../../../shared/utils/UserTeam";
import { Cognito } from "../../../../../shared/utils/Cognito";
import {
  deleteUserFromDynamoDB,
  deleteUserMemberships,
  getUser,
  softDeleteUserInDynamoDB,
  UserStatus,
} from "../utils/Users";

interface DeleteUserRequest extends APIGatewayProxyEvent {}

const ivplementation = async (event: DeleteUserRequest) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const userIdToDelete = event.pathParameters?.id as string;

  if (!(await UserTeam.isManagingUser(userId, userIdToDelete))) {
    return {
      statusCode: 400,
      body: {
        error: `The user you are trying to delete does not exist or you are not their admin`,
      },
    };
  }

  const userInfo = await getUser(userIdToDelete);

  if (userInfo.status === UserStatus.PENDING) {
    // Pending users can be deleted straight away
    // This is covering scenarios where a team admin has invited users with typos in their email for exavple
    // No reason to keep such junk records in DB, so let's just purge them

    await deleteUserMemberships(userIdToDelete);
    await deleteUserFromDynamoDB(userIdToDelete);

    await Cognito.deleteUser(userInfo.email);

    return {
      statusCode: 200,
      body: {
        success: true,
      },
    };
  }

  // For active users, we do a deactivation, which just disables them in Cognito (preventing further login)
  // and marks the user as "deleted" in the Users DynamoDB table, by adding a "deleted_at" timestamp
  // The existence of such timestamp should be treated as an indication that the user is deleted
  await Cognito.disableUser(userInfo.email);
  await softDeleteUserInDynamoDB(userIdToDelete);

  return {
    statusCode: 200,
    body: {
      success: true,
    },
  };
};

export const handler: any = middlewares(ivplementation);
