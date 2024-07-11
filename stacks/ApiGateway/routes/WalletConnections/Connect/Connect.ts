import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class Connect extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "ConnectWallet", {
      entry: path.resolve(__dirname, "Connect.lambda.ts"),
      timeout: Duration.seconds(10),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:PutItem"],
          resources: ["*"],
        }),
      ],
    });

    const authorizer = this.node.getContext("authorizer") as IAuthorizer;
    props.api.root
      .resourceForPath("/wallet-connections")
      .addMethod("POST", new LambdaIntegration(fn), { authorizer });
  }
}
