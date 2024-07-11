import { Construct } from "constructs";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  AuthorizationType,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class Login extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "UserLoginFunction", {
      entry: path.resolve(__dirname, "Login.lambda.ts"),
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: ["cognito-idp:AdminInitiateAuth"],
          resources: ["*"],
        }),
      ],
    });
    props.api.root
      .resourceForPath("/auth/login")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: {
          authorizationType: AuthorizationType.NONE,
          authorizerId: "",
        },
      });
  }
}
