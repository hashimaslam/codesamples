import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class Create extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "UsersCreate", {
      entry: path.resolve(__dirname, "Create.lambda.ts"),
      description: `Endpoint: POST /users`,
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
          actions: ["secretsmanager:GetRandomPassword"],
          resources: ["*"],
        }),
        new PolicyStatement({
          actions: [
            "cognito-idp:AdminGetUser",
            "cognito-idp:AdminCreateUser",
            "cognito-idp:AdminSetUserPassword",
            "cognito-idp:AdminDisableUser",
            "cognito-idp:AdminDeleteUser",
          ],
          resources: ["*"],
        }),
      ],
    });
    props.api.root
      .resourceForPath("/users")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
