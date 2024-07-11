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

export class Clone extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "CloneToken", {
      entry: path.resolve(__dirname, "Clone.lambda.ts"),
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:Query"],
          resources: ["*"],
        }),
      ],
    });

    fn.addToRolePolicy(
      new PolicyStatement({
        actions: ["s3:Put*", "s3:Get*", "s3:CopyObject", "ssm:GetParameter"],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/tokens/clone/{id}")
      .addMethod("PUT", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
