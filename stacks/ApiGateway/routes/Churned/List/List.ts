import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";

export class List extends Construct {
  constructor(scope: Construct, id: string, private props: { api: IRestApi }) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-TypescriptFunction`, {
      entry: path.resolve(__dirname, "List.lambda.ts"),
      timeout: Duration.seconds(30),
      description: "GET /churned",
    });

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );

    props.api.root
      .resourceForPath("/churned")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
