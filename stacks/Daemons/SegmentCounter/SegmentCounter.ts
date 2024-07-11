import { Construct } from "constructs";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";

export class SegmentCounter extends Construct {
  constructor(scope: Construct, private id: string) {
    super(scope, id);

    const lambdaFn = new TypescriptFunction(this, "SegmentCounter.Lambda", {
      entry: path.resolve(__dirname, "SegmentCounter.lambda.ts"),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:UpdateItem",
            "dynamodb:BatchGetItem",
            "dynamodb:GetItem",
            "dynamodb:Query",
          ],
          resources: ["*"],
        }),
      ],
    });

    const schedule = Schedule.rate(Duration.minutes(20));
    const rule = new Rule(this, "Rule", {
      schedule,
    });
    rule.addTarget(new LambdaFunction(lambdaFn));
  }
}
