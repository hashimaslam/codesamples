import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class Put extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "Put.lambda.ts"),
      timeout: Duration.minutes(15),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:UpdateItem",
          ],
          resources: ["*"],
        }),
      ],
    });

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    props.api.root
      .resourceForPath("/sources/{id}")
      .addMethod("PUT", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
