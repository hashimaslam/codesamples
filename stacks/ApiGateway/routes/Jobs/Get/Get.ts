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

export class Get extends Construct {
  constructor(
    scope: Construct,
    private id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);
    this.createGetJobStatusEndpoint();
  }

  private createGetJobStatusEndpoint() {
    const fn = new TypescriptFunction(this, `${this.id}-Get.lambda.ts`, {
      entry: path.resolve(__dirname, "Get.lambda.ts"),
      handler: "handler",
      description: "Lambda to get the status from a Background Job",
      timeout: Duration.seconds(10),
      memorySize: 1024,
      initialPolicy: [
        new PolicyStatement({
          actions: ["secretsmanager:GetSecretValue"],
          resources: ["*"],
        }),
      ],
    });

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    this.props.api.root
      .resourceForPath("/jobs/{id}")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
