import { Construct } from "constructs";
import { IRestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AuthorizedRestApi } from "../../../AuthorizedRestApi";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class GetCheckoutInfo extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "GetCheckoutInfo", {
      entry: path.resolve(__dirname, "GetCheckoutInfo.lambda.ts"),
      description: `Endpoint: GET /collections/checkout/{id}`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:Query",
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
      .resourceForPath("/collections/checkout/{id}")
      .addMethod("GET", new LambdaIntegration(fn));
  }
}
