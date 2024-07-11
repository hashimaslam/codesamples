import { Construct } from "constructs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import * as path from "path";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";
import {
  DATA_PROVIDER_SQS_CONCURRENCY,
  INGEST_FREQUENCY_HOURS,
  SQS_INGEST_QUEUE_SUFFIX_NAME,
} from "../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

import { envName } from "../../../../bin/envName";

export class DataIngester extends Construct {
  private sqsQueue: Queue;
  private sqsEventSource: SqsEventSource;

  constructor(scope: Construct, private id: string) {
    super(scope, id);
    this.createSQSqueue();
    this.createEventManagerLambda();
    this.createDataIngesterLambda();
  }

  private createSQSqueue() {
    this.sqsQueue = new Queue(this, `${this.id}-IngestData.SqsQueue`, {
      queueName: `${envName()}${SQS_INGEST_QUEUE_SUFFIX_NAME}`,
      visibilityTimeout: Duration.minutes(15), //15 minutes
    });

    this.sqsEventSource = new SqsEventSource(this.sqsQueue, {
      maxConcurrency: DATA_PROVIDER_SQS_CONCURRENCY,
    });
  }

  private createEventManagerLambda() {
    const fn = new TypescriptFunction(
      this,
      `${this.id}-DataIngester.eventManager.lambda.ts`,
      {
        entry: path.resolve(__dirname, "DataIngester.eventManager.lambda.ts"),
        timeout: Duration.minutes(15),
        memorySize: 1024,
        description: `Audience Data Ingester Consumer. Don't execute manually as need to receive parametrized events`,
        initialPolicy: [
          new PolicyStatement({
            actions: [
              "dynamodb:Query",
              "dynamodb:BatchWriteItem",
              "dynamodb:GetItem",
              "dynamodb:DeleteItem",
              "sqs:DeleteMessage",
            ],
            resources: ["*"],
          }),
        ],
      }
    );
    fn.addEventSource(this.sqsEventSource);
  }

  private createDataIngesterLambda() {
    const fn = new TypescriptFunction(
      this,
      `${this.id}-DataIngester.lambda.ts`,
      {
        entry: path.resolve(__dirname, "DataIngester.lambda.ts"),
        timeout: Duration.minutes(15), // Maximum allowed by Lambda
        description: `Data ingester to gather data from data provider. Ran by a cron job every few hours, sends messages to the SQS queue ${this.sqsQueue.queueName}`,
        memorySize: 1024,
        initialPolicy: [
          new PolicyStatement({
            actions: [
              "dynamodb:Query",
              "dynamodb:GetItem",
              "sqs:SendMessage",
              "sqs:GetQueueUrl",
              "sqs:GetQueueAttributes",
            ],
            resources: ["*"],
          }),
        ],
      }
    );

    // In dev mode, you can always run the Lambda from the AWS console,
    // so don't rely/wait on this cron for testing
    if (envName() === "production" || envName() === "staging") {
      const schedule = Schedule.rate(Duration.hours(INGEST_FREQUENCY_HOURS));
      const rule = new Rule(this, "Rule", {
        schedule,
      });
      rule.addTarget(new LambdaFunction(fn));
    }
  }
}
