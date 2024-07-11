import { Duration } from "aws-cdk-lib";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { Construct } from "constructs";
import * as path from "path";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class ExportCsv extends Construct {
  constructor(scope: Construct, id: string, private props: { api: IRestApi }) {
    super(scope, id);

    const fnBg = new TypescriptFunction(
      this,
      `${id}-ExportChurnedCsv.background.lambda.ts`,
      {
        entry: path.resolve(__dirname, "ExportCsv.background.lambda.ts"),
        timeout: Duration.minutes(15),
        description: "Background exporter for CSV audiences",
      }
    );

    fnBg.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    fnBg.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );

    const fn = new TypescriptFunction(this, `${id}-ExportChurnedCsv.startJob`, {
      entry: path.resolve(__dirname, "ExportCsv.startJob.lambda.ts"),
      description: `Endpoint: Get /churned/csv`,
      timeout: Duration.seconds(10),
      environment: {
        ARN_LAMBDA_FOR_BACKGROUND_EXPORTING_CHURNED: fnBg.functionArn,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:GetItem", "dynamodb:Query"],
          resources: ["*"],
        }),
      ],
    });
    fnBg.grantInvoke(fn);

    props.api.root
      .resourceForPath("/churned/csv")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
