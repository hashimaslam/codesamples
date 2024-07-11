import {
  AuthorizationType,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class SubmitForm extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-SubmitForm.lambda.ts`, {
      entry: path.resolve(__dirname, "SubmitForm.lambda.ts"),
      description: "Endpoint: POST /forms/submit/{id}",
      timeout: Duration.seconds(120),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:WriteItem",
            "dynamodb:UpdateItem",
            "dynamodb:Query",
          ],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("/forms/submit/{id}")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: {
          authorizerId: "",
          authorizationType: AuthorizationType.NONE,
        },
      });
  }
}
