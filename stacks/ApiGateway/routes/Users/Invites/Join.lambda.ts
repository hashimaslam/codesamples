import { APIGatewayProxyHandler } from "aws-lambda";
import { getJwtPrivateKey, getUser } from "./SendInvite.lambda";
import { decode, verify } from "jsonwebtoken";
import { CognitoIdentityServiceProvider, DynamoDB } from "aws-sdk";
import { Cognito } from "../../../../../shared/utils/Cognito";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { UserStatus } from "../utils/Users";

async function updateDynamoUserStatus(id: string, status: UserStatus.ACTIVE) {
  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.users(),
      Key: DynamoDB.Converter.marshall({ id }),
      UpdateExpression: `set #status=:status`,
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":status": status,
      }),
    })
    .promise();
  if (result.$response.error) {
    console.error(result.$response.error);
    throw new Error(`Failed to update user status in DynamoDB`);
  }
  return true;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { token, password } = JSON.parse(event.body || "{}") as {
    token: string;
    password: string;
  };

  if (!password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid field provided: password",
      }),
    };
  }

  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid field provided: token",
      }),
    };
  }

  const privateKey = await getJwtPrivateKey();

  if (!verify(token, privateKey)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "The provided token is invalid",
      }),
    };
  }

  const decoded = decode(token) as {
    id: string;
    email: string;
  };
  const { id } = decoded;

  try {
    const user = await getUser(id);

    if (user.status === UserStatus.DELETED) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "We are unable to activate your account, please contact your team administrator for more info",
        }),
      };
    }

    if (user.status !== UserStatus.PENDING) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "You have already activated your account, you can try to Sign in instead",
        }),
      };
    }

    // Activate the user and update his password to the one provided
    const cognito = new CognitoIdentityServiceProvider();
    const UserPoolId = await Cognito.getUserPoolId();
    await cognito
      .adminSetUserPassword({
        Permanent: true,
        Username: user.email,
        Password: password,
        UserPoolId,
      })
      .promise();

    await Cognito.enableUser(user.email);

    await updateDynamoUserStatus(id, UserStatus.ACTIVE);

    return {
      statusCode: 200,
      body: JSON.stringify({
        user,
      }),
    };
  } catch (e) {
    if ((e as any).toString().includes("User not found in DynamoDB")) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "We are unable to activate your account, please contact your team administrator for more info",
        }),
      };
    }
    throw e;
  }
};
