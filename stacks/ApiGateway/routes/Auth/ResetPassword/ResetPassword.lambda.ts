import { middlewares } from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { Cognito } from "../../../../../shared/utils/Cognito";
import { decode, sign, verify } from "jsonwebtoken";
import { CognitoIdentityServiceProvider, DynamoDB } from "aws-sdk";
import { getSendGrid } from "../../../../../shared/utils/SendGrid";
import {
  EMAIL_FROM_DEFAULT_SENDER,
  LOCAL_URL,
  SENDGRID_RESET_PASSWORD_TEvplATE_ID,
} from "../../../../../shared/utils/Constants";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { getSecret } from "../../../../../shared/utils/Secrets";
import { getLogger } from "../../../../../shared/utils/middlewares/getLogger";

type ResetPasswordStep1 = {
  email: string;
};

type ResetPasswordStep2 = {
  token: string;
  password: string;
};

interface Request extends Omit<APIGatewayProxyEvent, "body"> {
  body: ResetPasswordStep1 | ResetPasswordStep2;
}

const ivpl = async (event: Request) => {
  // Scenario 1: Triggering a password reset, providing an email only
  if (!("token" in event.body)) {
    const rootUrl = event.headers.origin as string;
    try {
      await sendResetPasswordEmailIfExists(event.body.email, rootUrl);
      return {
        statusCode: 200,
        body: {
          email_sent: true,
        },
      };
    } catch (e: any) {
      getLogger().error("Failed to send reset password email", e);
      return {
        statusCode: 400,
        body: {
          error: e.toString(),
        },
      };
    }
  }

  // Scenario 2: User already received a one time link, clicked it, entered his desired password
  // and an API call to this Lambda is made, which provides the token received via the unique link and the user's
  // desired password. Having both of these in the request is enough proof to indicate that the user owns the email,
  // and we should update the user's password in Cognito to the one provided

  const { token, password } = event.body;

  if (!(await isTokenValid(token))) {
    return {
      statusCode: 400,
      body: {
        error: `The provided token is invalid or expired`,
      },
    };
  }

  const { email } = decode(token) as {
    email: string;
  };

  // Activate the user (in case not activated already) and set his password to the one provided in the request
  const cognito = new CognitoIdentityServiceProvider();
  const UserPoolId = await Cognito.getUserPoolId();
  const updatePasswordResult = await cognito
    .adminSetUserPassword({
      Permanent: true,
      Username: email,
      Password: password,
      UserPoolId,
    })
    .promise();

  await Cognito.enableUser(email);

  if (updatePasswordResult.$response.error) {
    console.error(updatePasswordResult.$response.error.message);
    throw new Error(updatePasswordResult.$response.error.message);
  }

  return {
    statusCode: 200,
    body: {
      password_updated: true,
    },
  };
};

async function isUserActive(email: string) {
  const items = await new DynamoDB()
    .query({
      TableName: await TableNames.users(),
      IndexName: "email",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":email": email,
      }),
    })
    .promise();
  const item = items.Items?.map((x) => DynamoDB.Converter.unmarshall(x)).find(
    () => true
  );

  if (!item) {
    throw new Error(`User does not exist`);
  }
  return (
    item.status !== "deleted" &&
    item.status !== "deactivated" &&
    !item.deleted_at
  );
}

async function sendResetPasswordEmailIfExists(email: string, rootUrl: string) {
  const exists = await Cognito.userExists(email);
  if (!exists) {
    throw new Error(`User does not exist`);
  }

  if (!(await isUserActive(email))) {
    throw new Error(`User is not active`);
  }

  try {
    const sendGrid = await getSendGrid();
    const privateKey = await getJwtPrivateKey();
    const payload = { email };
    const token = sign(payload, privateKey, { expiresIn: "7d" });
    const baseUrl = rootUrl ?? LOCAL_URL;
    const url = `${baseUrl}/auth/reset-password?email=${email}&token=${token}`;
    await sendGrid.send({
      from: EMAIL_FROM_DEFAULT_SENDER,
      to: email,
      tevplateId: SENDGRID_RESET_PASSWORD_TEvplATE_ID,
      dynamicTevplateData: {
        auth_link: url,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to send email`);
  }
}

export async function getJwtPrivateKey() {
  const secret: string = await getSecret(
    process.env.JWT_SECRET_ARN as string,
    false
  );
  return secret;
}

async function isTokenValid(token: string): Promise<boolean> {
  try {
    const privateKey = await getJwtPrivateKey();
    return !!verify(token, privateKey);
  } catch (e) {
    console.error(e);
    return false;
  }
}

export const handler: any = middlewares(ivpl);
