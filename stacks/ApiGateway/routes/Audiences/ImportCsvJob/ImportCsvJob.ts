import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

export class ImportCsvJob extends Construct {
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
    this.createEndpointStartJob();
  }

  private createEndpointStartJob() {
    const fn = new TypescriptFunction(
      this,
      `${this.id}-ImportCsvJob.startJob.lambda.ts`,
      {
        entry: path.resolve(__dirname, "ImportCsvJob.startJob.lambda.ts"),
        timeout: Duration.seconds(10),
        environment: {
          ARN_LAMBDA_FOR_BACKGROUND_PROCESSING: this.fnBackground.functionArn,
        },
        memorySize: 1024,
      }
    );
    this.fnBackground.grantInvoke(fn);
    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    this.props.api.root
      .resourceForPath("/audiences/csv/job")
      .addMethod("POST", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }

  private createBackgroundLambda() {
    this.fnBackground = new TypescriptFunction(
      this,
      `${this.id}-ImportCsvJob.background.lambda.ts`,
      {
        entry: path.resolve(__dirname, "ImportCsvJob.background.lambda.ts"),
        timeout: Duration.minutes(15),
        memorySize: 3008,
        description: "Background importer for CSV files",
      }
    );
    this.fnBackground.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
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
