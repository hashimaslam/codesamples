import { Construct } from "constructs";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class Delete extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "DeleteAirdrop", {
      entry: path.resolve(__dirname, "Delete.lambda.ts"),
      description: `Endpoint: DELETE /airdrop/{collection_id}/{id}`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:Query",
            "dynamodb:GetItem",
            "dynamodb:DeleteItem",
          ],
          resources: ["*"],
        }),
      ],
    });

    fn.addToRolePolicy(
      new PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: ["*"],
      })
    );

    props.api.root
      .resourceForPath("/airdrop/{collection_id}/{id}")
      .addMethod("DELETE", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
