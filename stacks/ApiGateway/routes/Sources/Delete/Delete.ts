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

    this.createRunSourceDeletionEndpoint();
    this.createStartSourceDeletionEndpoint();
  }

  private createStartSourceDeletionEndpoint() {
    const fn = new TypescriptFunction(this, `${this.id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "Delete.lambda.ts"),
      description: `Endpoint: DELETE /sources/{id}`,
      timeout: Duration.minutes(15), // Increase the timeout if it takes more time to clear out all the audiences data
      initialPolicy: [
        new PolicyStatement({
          actions: [],
          resources: ["*"],
        }),
      ],
      environment: {
        ARN_LAMBDA_FOR_BACKGROUND_SOURCE_DELETION:
          this.fnBackground.functionArn,
      },
    });

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );

    this.fnBackground.grantInvoke(fn);

    this.props.api.root
      .resourceForPath("/sources/{id}")
      .addMethod("DELETE", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }

  private createRunSourceDeletionEndpoint() {
    this.fnBackground = new TypescriptFunction(
      this,
      `${this.id}-Delete.background.lambda.ts`,
      {
        entry: path.resolve(__dirname, "Delete.background.lambda.ts"),
        timeout: Duration.seconds(90),
        memorySize: 1024,
        initialPolicy: [
          new PolicyStatement({
            actions: ["dynamodb:Query", "dynamodb:GetItem"],
            resources: ["*"],
          }),
        ],
      }
    );

    this.fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    this.fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );
  }
}
