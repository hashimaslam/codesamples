import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../../../AuthorizedRestApi";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../../shared/constructs/TypescriptFunction";

export class ValidateCSV extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "ValidateCSV.lambda.ts"),
      timeout: Duration.seconds(30),
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
          "secretsmanager:GetSecretValue",
        ],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/tokens/validate-csv")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
