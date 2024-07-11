import { Construct } from "constructs";
import { IRestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../../shared/constructs/TypescriptFunction";

export class Buy extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "BuyToken", {
      entry: path.resolve(__dirname, "Buy.lambda.ts"),
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:UpdateItem",
            "dynamodb:PutItem",
            "secretsmanager:GetSecretValue",
          ],
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
      .resourceForPath("/tokens/buy/{id}")
      .addMethod("POST", new LambdaIntegration(fn));
  }
}
