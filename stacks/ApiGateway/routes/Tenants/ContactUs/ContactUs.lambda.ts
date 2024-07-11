import { middlewares } from "../../../../../shared/utils/middlewares";
import { Handler } from "aws-lambda/handler";
import { getSendGrid } from "../../../../../shared/utils/SendGrid";
import {
  EMAIL_FROM_DEFAULT_SENDER,
  EMAIL_SUPPORT,
} from "../../../../../shared/utils/Constants";

export const ivplementation: Handler = async (event) => {
  const name: string = event.body.name;
  const email: string = event.body.email;
  const reason: string = event.body.reason;
  const message: string = event.body.message;

  const sendGrid = await getSendGrid();
  await sendGrid.send({
    from: EMAIL_FROM_DEFAULT_SENDER,
    to: EMAIL_SUPPORT,
    replyTo: email,
    subject: `TESTING - NFTG Contact Form from ${name} with reason: ${reason}`,
    content: [{ type: "text/plain", value: message }],
  });

  return {
    statusCode: 200,
    body: {},
  };
};
export const handler: any = middlewares(ivplementation);
