import { Construct } from "constructs";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class Post extends Construct {
  private fnBackground: NodejsFunction;

  constructor(
    scope: Construct,
    private id: string,
    private props: { api: IRestApi }
  ) {
    super(scope, id);

    this.createBackgroundLambda();
    this.createEndpointPostJob();
  }

  private createEndpointPostJob() {
    const fn = new TypescriptFunction(this, `${this.id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "Post.lambda.ts"),
      description: `Endpoint: POST /sources`,
      timeout: Duration.seconds(30),
      environment: {
        ARN_LAMBDA_FOR_BACKGROUND_PROCESSING: this.fnBackground.functionArn,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ["secretsmanager:GetSecretValue"],
          resources: ["*"],
        }),
      ],
    });

    this.fnBackground.grantInvoke(fn);

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    this.props.api.root
      .resourceForPath("/sources")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }

  private createBackgroundLambda() {
    this.fnBackground = new TypescriptFunction(
      this,
      `${this.id}-Post.background.lambda.ts`,
      {
        entry: path.resolve(__dirname, "Post.background.lambda.ts"),
        timeout: Duration.minutes(15),
        memorySize: 1024,
        description: "Background import of audiences from contract",
        initialPolicy: [
          new PolicyStatement({
            actions: ["secretsmanager:GetSecretValue"],
            resources: ["*"],
          }),
        ],
      }
    );

    this.fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
  }
}
