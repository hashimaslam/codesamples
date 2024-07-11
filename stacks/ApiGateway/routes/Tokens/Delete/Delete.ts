import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../../AuthorizedRestApi";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class Delete extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "DeleteToken", {
      entry: path.resolve(__dirname, "Delete.lambda.ts"),
      description: `Endpoint: DELETE /tokens/{id}`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:GetItem",
            "dynamodb:DeleteItem",
          ],
          resources: ["*"],
        }),
      ],
    });
    fn.addToRolePolicy(
      new PolicyStatement({
        actions: ["s3:Put*", "s3:DeleteObject", "ssm:GetParameter"],
        resources: ["*"],
      })
    );
    props.api.root
      .resourceForPath("/tokens/{id}")
      .addMethod("DELETE", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
