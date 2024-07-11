import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";

export class Delete extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const deleteFormIntegration = new TypescriptFunction(
      this,
      `${id}-TypescriptFunction`,
      {
        entry: path.resolve(__dirname, "Delete.lambda.ts"),
      }
    );

    props.api.root
      .resourceForPath("forms/{id}")
      .addMethod("DELETE", new LambdaIntegration(deleteFormIntegration), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
