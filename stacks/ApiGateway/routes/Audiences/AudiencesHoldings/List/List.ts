import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TypescriptFunction } from "../../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class List extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "List.lambda.ts"),
      description: "Endpoint: GET /audiences/{id}/holdings",
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:PutItem"],
          resources: ["*"],
        }),
      ],
    });

    fn.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );

    props.api.root
      .resourceForPath("/audiences/{id}/holdings")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.tryGetContext("authorizer") as IAuthorizer,
      });
  }
}
