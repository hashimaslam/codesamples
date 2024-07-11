import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { sign } from "jsonwebtoken";
import { getSendGrid } from "../../../../../shared/utils/SendGrid";
import {
  EMAIL_FROM_DEFAULT_SENDER,
  LOCAL_URL,
  SENDGRID_SEND_INVITE_TEvplATE_ID,
} from "../../../../../shared/utils/Constants";
import { getTeamOfUser, UserRole, UserStatus } from "../utils/Users";
import { getSecret } from "../../../../../shared/utils/Secrets";

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub as string; // Current logged in user
  const id = event.pathParameters?.id as string; // Target user ID

  const team = await getTeamOfUser(userId);

  if (!team || team.role !== UserRole.ADMIN) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Sorry, you are not an admin of any teams yet. You can not manage users",
      }),
    };
  }

  const senderEmail = event.requestContext.authorizer?.claims[
    "cognito:username"
  ] as string;

  const user = await getUser(id);

  if (!user.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Sorry this user doesn't exist or doesn't have a valid email",
      }),
    };
  }

  if (!user.full_name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Sorry this user doesn't have a valid full name",
      }),
    };
  }

  if (user.status !== UserStatus.PENDING) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "This user is already active. Invite can not be sent for active users.",
      }),
    };
  }

  const receiverEmail = user.email;
  const baseUrl = event.headers.origin as string;

  const joinUrl = await getJoinUrl({
    id,
    email: receiverEmail,
    baseUrl,
  });

  await sendInviteEmail({
    senderEmail,
    receiverEmail,
    joinUrl,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const getUser = async (id: string) => {
  const item = await new DynamoDB()
    .getItem({
      TableName: await TableNames.users(),
      Key: DynamoDB.Converter.marshall({ id }),
    })
    .promise();

  if (!item.Item) {
    throw new Error(`User not found in DynamoDB`);
  }

  const unmarshalled = DynamoDB.Converter.unmarshall(item.Item);
  return {
    full_name: unmarshalled.full_name as string,
    email: unmarshalled.email as string,
    status: unmarshalled.status as UserStatus,
  };
};

async function sendInviteEmail(props: {
  senderEmail: string;
  receiverEmail: string;
  joinUrl: string;
}) {
  const { joinUrl, receiverEmail, senderEmail } = props;
  const sendGrid = await getSendGrid();
  return await sendGrid.send({
    from: EMAIL_FROM_DEFAULT_SENDER,
    to: receiverEmail,
    tevplateId: SENDGRID_SEND_INVITE_TEvplATE_ID,
    dynamicTevplateData: {
      senderEmail,
      auth_link: joinUrl,
    },
  });
}

export const getJwtPrivateKey = async () =>
  await getSecret(process.env.JWT_SECRET_ARN as string, false);

async function getJoinUrl(props: {
  id: string;
  email: string;
  baseUrl: string;
}) {
  const { email, id } = props;
  const privateKey = await getJwtPrivateKey();
  const payload = { id, email };
  const token = sign(payload, privateKey, { expiresIn: "365d" });
  const baseUrl = props.baseUrl ?? LOCAL_URL;
  return `${baseUrl}/auth/join-team/?id=${id}&email=${email}&token=${token}`;
}
