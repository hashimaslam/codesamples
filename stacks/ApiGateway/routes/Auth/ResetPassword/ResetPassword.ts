import { Construct } from "constructs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  AuthorizationType,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class ResetPassword extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const secret = new Secret(this, "Secret");

    const fn = new TypescriptFunction(this, "UserResetPassword", {
      entry: path.resolve(__dirname, "ResetPassword.lambda.ts"),
      description: `Endpoint: POST /auth/reset-password`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:BatchGetItem",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
          ],
          resources: ["*"],
        }),
        new PolicyStatement({
          actions: [
            "cognito-idp:AdminGetUser",
            "cognito-idp:AdminSetUserPassword",
            "cognito-idp:AdminEnableUser",
          ],
          resources: ["*"],
        }),
      ],
      environment: {
        JWT_SECRET_ARN: secret.secretArn,
      },
    });

    // Allow the Lambda to read the secret value
    secret.grantRead(fn);

    this.props.api.root
      .resourceForPath("/auth/reset-password")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: {
          authorizerId: "",
          authorizationType: AuthorizationType.NONE,
        },
      });
  }
}
