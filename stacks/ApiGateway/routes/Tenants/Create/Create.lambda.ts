import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { DynamoDB, SecretsManager, SSM } from "aws-sdk";
import { Cognito } from "../../../../../shared/utils/Cognito";
import { createUserInDynamoDb } from "../../Users/Create/Create.lambda";
import { UserRole, UserStatus } from "../../Users/utils/Users";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { DB } from "../../../../../shared/utils/DB";

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.headers.Authorization !== "protokol-secret-64jTp5KA") {
    // @TODO parameterize this. Pull from SSM, etc
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: "Not authorized",
      }),
    };
  }

  const body = JSON.parse(event.body || "{}") as {
    email: string;
    password?: string;
  };

  const email = body.email;
  const password = body.password ?? (await getRandomPassword());

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Provided parameter is invalid: email",
      }),
    };
  }

  if (await Cognito.userExists(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "This email is already registered",
      }),
    };
  }

  const team = await createTeam();
  const firstAdmin = await Cognito.createUser(email, password);
  await addTeamMember(team.id, firstAdmin.id, UserRole.ADMIN);
  await createUserInDynamoDb({
    id: firstAdmin.id,
    email,
    status: UserStatus.ACTIVE,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      user_id: firstAdmin.id,
      team_id: team.id,
    }),
  };
};

export async function getRandomPassword() {
  const res = await new SecretsManager().getRandomPassword().promise();
  return res.RandomPassword as string;
}

export async function createTeam() {
  const id = uuid();

  const getTableName = async () => {
    const r = await new SSM()
      .getParameter({
        Name: `/nft-governor/${process.env.AWS_ENV}/table/Teams/name`,
      })
      .promise();
    if (!r.Parameter?.Value) {
      throw new Error(`Can not resolve table name from SSM for Teams table`);
    }
    return r.Parameter.Value;
  };
  await DB.write(await getTableName(), { id });
  return {
    id,
  };
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  role: UserRole
) {
  await DB.write(await TableNames.teamMembers(), {
    team_id: teamId,
    member_id: userId,
    role,
  });
  return true;
}
