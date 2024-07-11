import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class Get extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "Get.lambda.ts"),
      description: "Endpoint: GET /audiences/{id}",
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:BatchWriteItem",
            "dynamodb:DeleteItem",
            "secretsmanager:GetSecretValue",
          ],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("/audiences/{id}")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
