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

export class Dashboard extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "Dashboard", {
      entry: path.resolve(__dirname, "Dashboard.lambda.ts"),
      description: `Endpoint: GET /statistics/dashboard`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:GetItem",
            "dynamodb:BatchGetItem",
          ],
          resources: ["*"],
        }),
        new PolicyStatement({
          actions: ["ssm:GetParameter"],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("/statistics/dashboard")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
