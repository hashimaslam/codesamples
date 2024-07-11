import {
  AuthorizationType,
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

import { AuthorizedRestApi } from "../../../AuthorizedRestApi";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class GetPresignedUrl extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "GetPresignedUrl", {
      entry: path.resolve(__dirname, "GetPresignedUrl.lambda.ts"),
      timeout: Duration.seconds(30),
    });
    fn.addToRolePolicy(
      new PolicyStatement({
        actions: ["s3:Put*", "s3:Get*", "ssm:GetParameter"],
        resources: ["*"],
      })
    );
    props.api.root
      .resourceForPath("storage/presigned-url")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
