import { Construct } from "constructs";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class ValidateAddress extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "ValidateAddress.lambda.ts"),
      description: `Endpoint: POST /sources/validate-address`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:GetItem",
            "secretsmanager:GetSecretValue",
          ],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("sources/validate-address")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
