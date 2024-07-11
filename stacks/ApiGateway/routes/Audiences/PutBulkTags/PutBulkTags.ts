import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class PutBulkTags extends Construct {
  private fnBackground: NodejsFunction;

  constructor(
    scope: Construct,
    private id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    this.createBackgroundLambda();
    this.createEndpointPostJob();
  }

  private createEndpointPostJob() {
    const fn = new TypescriptFunction(this, `${this.id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "PutBulkTags.lambda.ts"),
      description: `Endpoint: PUT /audiences/tags/bulk`,
      timeout: Duration.seconds(30),
      environment: {
        ARN_LAMBDA_FOR_BACKGROUND_PROCESSING: this.fnBackground.functionArn,
      },
    });

    this.fnBackground.grantInvoke(fn);

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    this.props.api.root
      .resourceForPath("/audiences/tags/bulk")
      .addMethod("PUT", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }

  private createBackgroundLambda() {
    this.fnBackground = new TypescriptFunction(
      this,
      `${this.id}-PutBulkTags.background.lambda.ts`,
      {
        entry: path.resolve(__dirname, "PutBulkTags.background.lambda.ts"),
        timeout: Duration.minutes(15),
        memorySize: 1024,
        description: "Background job to create/add bulk tags to audiences",
      }
    );

    this.fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
  }
}
