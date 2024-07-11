import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AuthorizedRestApi } from "../../../AuthorizedRestApi";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class Update extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "User-UpdateSingle", {
      entry: path.resolve(__dirname, "Update.lambda.ts"),
      description: `Endpoint: POST /users/{id}`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:BatchGetItem",
            "dynamodb:GetItem",
            "dynamodb:UpdateItem",

            // Allow reactivating disabled users
            "cognito-idp:AdminEnableUser",
          ],
          resources: ["*"],
        }),
      ],
    });
    props.api.root
      .resourceForPath("/users/{id}")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
