import { APIGatewayProxyHandler } from "aws-lambda";
import {
  addTeamMember,
  getRandomPassword,
} from "../../Tenants/Create/Create.lambda";
import { Cognito } from "../../../../../shared/utils/Cognito";
import { TableNames } from "../../../../../shared/utils/TableNames";
import {
  getTeamOfUser,
  supportedRoles,
  UserRole,
  UserStatus,
} from "../utils/Users";
import { Time } from "../../../../../shared/utils/DateTime";
import { DB } from "../../../../../shared/utils/DB";

type Request = {
  username?: string;
  full_name?: string;
  email: string;
  wallet_address?: string;
  role: UserRole;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;

  const { email, username, full_name, wallet_address, role } = JSON.parse(
    event.body ?? "{}"
  ) as Request;

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

  if (!full_name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Required parameter not provided: Full name",
      }),
    };
  }

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Required parameter not provided: email" }),
    };
  }

  if (await Cognito.userExists(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "An account with this email already exists!",
      }),
    };
  }

  if (!supportedRoles.includes(role)) {
    const crole = role[0].toUpperCase() + role.slice(1);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Can not create user. Unsupported role provided: ${crole}. Supported roles: ${supportedRoles.join(
          ", "
        )}`,
      }),
    };
  }

  const { id } = await Cognito.createUser(email, await getRandomPassword());

  try {
    // User starts in a pending state until he/she is invited using the Invite endpoint
    // and accepts the invite link by clicking it in the received email
    await Cognito.disableUser(email);
    await createUserInDynamoDb({
      id,
      email,
      username,
      full_name,
      wallet_address,
      status: UserStatus.PENDING,
    });
    await addTeamMember(team.teamId, id, role);
  } catch (error) {
    await Cognito.deleteUser(email);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id,
      email,
      role,
      username,
      full_name,
      wallet_address,
    }),
  };
};

export const createUserInDynamoDb = async (props: {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  wallet_address?: string;
  status?: UserStatus.PENDING | UserStatus.ACTIVE;
}) => {
  const { id, email, username, full_name, wallet_address, status } = props;

  await DB.write(await TableNames.users(), {
    id,
    email,
    username,
    full_name,
    wallet_address,
    status,
    created_at: Time.now(),
    updated_at: Time.now(),
  });
  return true;
};
