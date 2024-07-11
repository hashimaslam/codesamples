import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../../../AuthorizedRestApi";

import * as path from "path";
import { Duration, Size } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../../shared/constructs/TypescriptFunction";

export class StartJob extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    /**
     * This Lambda does the actual heavy lifting
     * It runs in the background, and for heavier CSVs (with many rows) it can take a few minutes to finish
     * Since API Gateway -> Lambda integrations are hard limited to 30 seconds,
     * we can not do this heavy operation directly in the foreground Lambda
     * Instead, the foreground Lambda just invokes th background Lambda in "async mode" and returns
     * a "job ID" which can be then used to query the status of the job, by a different API endpoint
     */
    const fnBackground = new TypescriptFunction(this, `${id}-Background`, {
      entry: path.resolve(__dirname, "StartJob.Background.lambda.ts"),
      timeout: Duration.seconds(300),
      memorySize: 1024, // More memory means better networking and CPU, allowing for faster CSV and ZIP file processing
      ephemeralStorageSize: Size.gibibytes(2),
    });
    fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );

    const fnForeground = new TypescriptFunction(this, `${id}-Start`, {
      entry: path.resolve(__dirname, "StartJob.lambda.ts"),
      environment: {
        ARN_LAMBDA_FOR_BACKGROUND_PROCESSING: fnBackground.functionArn,
      },
    });

    // Allow the foreground Lambda to invoke the background Lambda
    fnBackground.grantInvoke(fnForeground);

    // Allow the Lambda to create a Job ID in the background jobs table
    fnForeground.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "secretsmanager:GetSecretValue",
        ],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/tokens/bulk")
      .addMethod("PUT", new LambdaIntegration(fnForeground), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
