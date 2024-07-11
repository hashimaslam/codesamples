import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../../AuthorizedRestApi";

import * as path from "path";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class ValidateCSV extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "ValidateCSV.lambda.ts"),
      timeout: Duration.seconds(30),
      memorySize: 1024,
    });
    // Add the S3 AWS managed policy to the Lambda, allowing it to read objects from the TMP bucket
    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    fn.addToRolePolicy(
      new PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/audiences/validate-csv")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
