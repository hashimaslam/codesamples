import { Construct } from "constructs";
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
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "DeleteAllowList", {
      entry: path.resolve(__dirname, "Delete.lambda.ts"),
      description: `Endpoint: DELETE /allowlists/{id}`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:BatchWriteItem",
            "dynamodb:GetItem",
            "dynamodb:DeleteItem",
          ],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("/allowlists/{id}")
      .addMethod("DELETE", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
