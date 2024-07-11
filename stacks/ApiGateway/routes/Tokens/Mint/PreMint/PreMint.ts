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

export class PreMint extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "PreMintToken", {
      entry: path.resolve(__dirname, "PreMint.lambda.ts"),
      timeout: Duration.seconds(10),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:Query",
            "s3:Get*",
            "ssm:GetParameter",
            "secretsmanager:GetSecretValue",
          ],
          resources: ["*"],
        }),
      ],
      environment: {
        PINATA_API_KEY: process.env.PINATA_API_KEY as string, //optional
        PINATA_API_SECRET: process.env.PINATA_API_SECRET as string, //optional
      },
    });
    props.api.root
      .resourceForPath("/tokens/premint/{id}")
      .addMethod("PUT", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
