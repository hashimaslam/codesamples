import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";
import { AuthorizedRestApi } from "../../../AuthorizedRestApi";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

/**
 * Create a new tenant and its first admin
 */
export class Create extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "CreateTevplate", {
      entry: path.resolve(__dirname, "Create.lambda.ts"),
      description: "Endpoint: POST /tevplates",
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:PutItem",
            "dynamodb:Query",
            "dynamodb:BatchGetItem",
            "dynamodb:GetItem",
          ],
          resources: ["*"],
        }),
      ],
      timeout: Duration.seconds(10),
    });
    props.api.root
      .resourceForPath("/tevplates")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
