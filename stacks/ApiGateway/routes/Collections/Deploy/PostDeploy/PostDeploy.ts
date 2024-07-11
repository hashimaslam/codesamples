import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { AuthorizedRestApi } from "../../../../AuthorizedRestApi";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../../shared/constructs/TypescriptFunction";

export class PostDeploy extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "PostDeployCollection", {
      entry: path.resolve(__dirname, "PostDeploy.lambda.ts"),
      timeout: Duration.seconds(10),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:UpdateItem",
            "s3:Get*",
            "ssm:GetParameter",
          ],
          resources: ["*"],
        }),
      ],
    });
    props.api.root
      .resourceForPath("/collections/postdeploy/{id}")
      .addMethod("PUT", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
