import { Construct } from "constructs";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { TypescriptFunction } from "../../../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class TokensCreatedDaily extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "TokensCreatedDailyFunction", {
      entry: path.resolve(__dirname, "TokensCreatedDaily.lambda.ts"),
      timeout: Duration.minutes(1),
      description:
        "ANALYTICS: A background task that runs daily and computes the number of tokens created so far and stores them to OpenSearch for Analytics purposes",
    });

    new Rule(this, "Rule", {
      schedule: Schedule.rate(Duration.days(1)),
      targets: [new LambdaFunction(fn)],
    });
  }
}
