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

export class Get extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "GetCollection", {
      entry: path.resolve(__dirname, "Get.lambda.ts"),
      description: `Endpoint: GET /collections/{id}`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:GetItem", "dynamodb:Query"],
          resources: ["*"],
        }),
      ],
    });
    fn.addToRolePolicy(
      new PolicyStatement({
        actions: ["s3:Get*", "ssm:GetParameter"],
        resources: ["*"],
      })
    );
    props.api.root
      .resourceForPath("/collections/{id}")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
