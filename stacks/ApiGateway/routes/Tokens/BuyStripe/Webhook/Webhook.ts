import { Construct } from "constructs";
import { IRestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../../shared/constructs/TypescriptFunction";

export class Webhook extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "Webhook", {
      entry: path.resolve(__dirname, "Webhook.lambda.ts"),
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:Query",
            "dynamodb:UpdateItem",
          ],
          resources: ["*"],
        }),
      ],
    });

    fn.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "s3:Get*",
          "ssm:GetParameter",
          "secretsmanager:GetSecretValue",
        ],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/buytokenwh")
      .addMethod("POST", new LambdaIntegration(fn));
  }
}
