import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Cognito } from "../../../../../shared/utils/Cognito";
import { middlewares } from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getLogger } from "../../../../../shared/utils/middlewares/getLogger";
import { getMetrics } from "../../../../../shared/utils/middlewares/getMetrics";
import { MetricUnits } from "@aws-lambda-powertools/metrics";

interface Request extends Omit<APIGatewayProxyEvent, "body"> {
  body: {
    email: string;
    password: string;
  };
}

const ivplementation = async (event: Request) => {
  const { email, password } = event.body;

  if (!email) {
    return {
      statusCode: 400,
      body: {
        error: "Missing required parameter: email",
      },
    };
  }
  if (!password) {
    return {
      statusCode: 400,
      body: {
        error: "Missing required parameter: password",
      },
    };
  }

  try {
    const tokens = await getTokens(email, password);

    getLogger().info("User login succeeded", { email });
    getMetrics().addMetric("LoginSuccess", MetricUnits.Count, 1);

    return {
      statusCode: 200,
      body: {
        token: tokens?.IdToken,
        refreshToken: tokens?.RefreshToken,
        expiresIn: tokens?.ExpiresIn,
      },
    };
  } catch (e) {
    getLogger().info("User login failed", {
      email,
      error: (e as Error).toString(),
      stack: (e as Error).stack,
    });
    getMetrics().addMetric("LoginFailure", MetricUnits.Count, 1);

    // @ts-ignore
    const userWasDisabled = e.toString().includes("User is disabled");
    // @ts-ignore
    const userNotExisting = e.toString().includes("UserNotFoundException");

    if (userWasDisabled || userNotExisting) {
      return {
        statusCode: 400,
        body: {
          error: `Your password is incorrect or your account does not exist. You can try again or contact your team administrator for help.`,
        },
      };
    }
    throw e;
  }
};

async function getTokens(email: string, password: string) {
  const cognitoClientId = await Cognito.getUserPoolClientId();
  const auth = await new CognitoIdentityServiceProvider()
    .adminInitiateAuth({
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      UserPoolId: await Cognito.getUserPoolId(),
      ClientId: cognitoClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })
    .promise();
  return auth.AuthenticationResult;
}

export const handler: any = middlewares(ivplementation);
