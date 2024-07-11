import { Construct } from "constructs";
import { IRestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class GetPriceFeed extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "GetPriceFeed", {
      entry: path.resolve(__dirname, "GetPriceFeed.lambda.ts"),
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: ["secretsmanager:GetSecretValue", "ssm:GetParameter"],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("/price/{chain_id}/{token}")
      .addMethod("GET", new LambdaIntegration(fn));
  }
}
