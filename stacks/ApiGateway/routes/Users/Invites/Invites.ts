import { Construct } from "constructs";
import {
  AuthorizationType,
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { AuthorizedRestApi } from "../../../AuthorizedRestApi";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class Invites extends Construct {
  private secret: Secret;

  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    this.secret = new Secret(this, "Secret");

    this.sendInviteEndpoint();
    this.acceptInviteEndpoint();
  }

  private sendInviteEndpoint() {
    const fn = new TypescriptFunction(this, "UsersSendInvite", {
      entry: path.resolve(__dirname, "SendInvite.lambda.ts"),
      description: `Endpoint: POST /users/{id}/invite`,
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
          actions: ["cognito-idp:AdminGetUser"],
          resources: ["*"],
        }),
      ],
      environment: {
        JWT_SECRET_ARN: this.secret.secretArn,
      },
    });

    // Allow the Lambda to read the secret value
    this.secret.grantRead(fn);

    this.props.api.root
      .resourceForPath("/users/{id}/invite")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }

  private acceptInviteEndpoint() {
    const fn = new TypescriptFunction(this, "UserJoin", {
      entry: path.resolve(__dirname, "Join.lambda.ts"),
      description: `Endpoint: POST /users/join`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:BatchGetItem",
            "dynamodb:GetItem",
            "dynamodb:UpdateItem",
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
        JWT_SECRET_ARN: this.secret.secretArn,
      },
    });

    // Allow the Lambda to read the secret value
    this.secret.grantRead(fn);

    this.props.api.root
      .resourceForPath("/users/join")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: {
          authorizerId: "",
          authorizationType: AuthorizationType.NONE,
        },
      });
  }
}
