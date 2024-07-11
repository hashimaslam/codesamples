import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class Delete extends Construct {
  private fnBackground: NodejsFunction;

  constructor(
    scope: Construct,
    private id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    this.createEndpointPostJob();
    this.createBackgroundLambda();
  }

  private createEndpointPostJob() {
    this.fnBackground = new TypescriptFunction(
      this,
      `${this.id}-Delete.background.lambda.ts`,
      {
        entry: path.resolve(__dirname, "Delete.background.lambda.ts"),
        memorySize: 1024,
      }
    );

    this.fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
  }

  private createBackgroundLambda() {
    const fn = new TypescriptFunction(this, `${this.id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "Delete.lambda.ts"),
      description: `Endpoint: DELETE /segments/{id}`,
      timeout: Duration.minutes(15),
      environment: {
        ARN_LAMBDA_FOR_BACKGROUND_PROCESSING: this.fnBackground.functionArn,
      },
    });

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    this.fnBackground.grantInvoke(fn);

    this.props.api.root
      .resourceForPath("/segments/{id}")
      .addMethod("DELETE", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
