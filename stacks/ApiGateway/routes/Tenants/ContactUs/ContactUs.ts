import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../../AuthorizedRestApi";
import {
  AuthorizationType,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class ContactUs extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "Function-ContactUs", {
      entry: path.resolve(__dirname, "ContactUs.lambda.ts"),
    });

    props.api.root
      .resourceForPath("/contact")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: {
          authorizerId: "",
          authorizationType: AuthorizationType.NONE,
        },
      });
  }
}
