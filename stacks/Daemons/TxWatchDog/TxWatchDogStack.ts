import { Construct } from "constructs";
import * as path from "path";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";

import { envName } from "../../../../bin/envName";

export class TxWatchDogStack extends Construct {
  constructor(scope: Construct, private id: string) {
    super(scope, id);

    const lambdaFn = new TypescriptFunction(this, "TxWatchDogStack.Lambda", {
      entry: path.resolve(__dirname, "TxWatchDogStack.lambda.ts"),
      timeout: Duration.seconds(300),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:UpdateItem",
            "dynamodb:BatchGetItem",
            "dynamodb:GetItem",
            "dynamodb:Query",
            "secretsmanager:GetSecretValue",
            "ssm:GetParameter",
          ],
          resources: ["*"],
        }),
      ],
    });

    // See https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
    const schedule = Schedule.rate(
      envName() === "production" || envName() === "staging"
        ? Duration.minutes(5)
        : Duration.hours(6)
      //Duration.minutes(1) //For testing
    );
    const rule = new Rule(this, "Rule", {
      schedule,
    });

    rule.addTarget(new LambdaFunction(lambdaFn));
  }
}
