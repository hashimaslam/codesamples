import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../../../AuthorizedRestApi";

import * as path from "path";
import { Duration, Size } from "aws-cdk-lib";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { TypescriptFunction } from "../../../../../../shared/constructs/TypescriptFunction";

export class ValidateZip extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "ValidateZip.lambda.ts"),
      timeout: Duration.seconds(30),

      // Allocate more RAM (and proportionally faster CPU and networking) to the Lambda,
      // so that it can download and unzip larger archives
      memorySize: 1024,

      // Allow unzipping larger archives, by providing a 2GB /tmp folder to the Lambda
      // Also, in case of rare bugs in the code, where the Lambda fails to clean up after itself,
      // unzipped files can pile up for up to 45 minutes (until the next Lambda cold start)
      // but 2GB should be more than enough to accommodate for that edge case
      ephemeralStorageSize: Size.gibibytes(2),
    });

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );

    fn.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "s3:Put*",
          "s3:Get*",
          "s3:Query",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:CopyObject",
          "ssm:GetParameter",
        ],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/tokens/validate-zip")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
