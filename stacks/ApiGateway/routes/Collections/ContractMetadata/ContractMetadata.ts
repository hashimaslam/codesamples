import { Construct } from "constructs";
import {
  LambdaIntegration,
  RestApi,
  AuthorizationType,
  IRestApi,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

/**
 * Handles public endpoint for contractURI smart contract method
 * */
export class ContractMetadata extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "ContractMetadata", {
      entry: path.resolve(__dirname, "ContractMetadata.lambda.ts"),
      description: `Endpoint: GET /collections/{id}/metadata`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: ["ssm:GetParameter", "dynamodb:GetItem"],
          resources: ["*"],
        }),
      ],
    });

    props.api.root
      .resourceForPath("/collections/{id}/metadata")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: {
          authorizationType: AuthorizationType.NONE,
          authorizerId: "",
        },
      });
  }
}
