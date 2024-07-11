import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import * as path from "path";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";
import { Duration } from "aws-cdk-lib";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class ListSymbol extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, `${id}-NodejsFunction`, {
      entry: path.resolve(__dirname, "ListSymbol.lambda.ts"),
      description: `Endpoint: GET /sources/symbol`,
      timeout: Duration.seconds(30),
      initialPolicy: [
        new PolicyStatement({
          actions: [],
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
      .resourceForPath("/sources/symbol")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
