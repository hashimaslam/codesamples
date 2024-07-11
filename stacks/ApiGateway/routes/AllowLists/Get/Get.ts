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

    const fn = new TypescriptFunction(this, "GetAllowlistItems", {
      entry: path.resolve(__dirname, "Get.lambda.ts"),
      description: `Endpoint: GET /allowlists/{id}`,
      timeout: Duration.seconds(180),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:GetItem", "dynamodb:Query"],
          resources: ["*"],
        }),
      ],
    });

    fn.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "s3:Put*",
          "s3:Get*",
          "s3:Query",
          "s3:ListBucket",
          "s3:CopyObject",
          "ssm:GetParameter",
          "secretsmanager:GetSecretValue",
        ],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/allowlists/{id}")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
