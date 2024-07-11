import { Construct } from "constructs";
import {
  AuthorizationType,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

/**
 * Create a new tenant and its first admin
 */
export class Create extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "TenantCreate", {
      entry: path.resolve(__dirname, "Create.lambda.ts"),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:PutItem"],
          resources: ["*"],
        }),
        new PolicyStatement({
          actions: ["secretsmanager:GetRandomPassword"],
          resources: ["*"],
        }),
        new PolicyStatement({
          actions: [
            "cognito-idp:AdminCreateUser",
            "cognito-idp:AdminSetUserPassword",
            "cognito-idp:AdminGetUser",
          ],
          resources: ["*"],
        }),
      ],
      timeout: Duration.seconds(10),
    });
    props.api.root
      .resourceForPath("/tenants")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: {
          authorizerId: "",
          authorizationType: AuthorizationType.NONE,
        },
      });
  }
}
