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

export class PublicFormView extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-PublicFormView.lambda.ts`, {
      entry: path.resolve(__dirname, "PublicFormView.lambda.ts"),
      description: "Endpoint: GET /forms/{id}/public",
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:GetItem", "dynamodb:Query"],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("/forms/{id}/public")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: {
          authorizerId: "",
          authorizationType: AuthorizationType.NONE,
        },
      });
  }
}
