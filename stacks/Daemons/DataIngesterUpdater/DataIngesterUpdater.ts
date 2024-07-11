import { Construct } from "constructs";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

import { envName } from "../../../../bin/envName";

// This is a shared parameter that controls two things:
// 1. How long will SQS will wait before the consumer (the Lambda in this case) successfully handles
// the message and deletes it, before assuming it's a failed delivery and returning it to the queue.
// 2. How long will the Lambda be allowed to run before it's forcefully terminated by Lambda.
// Both things need to have the same duration, or optionally the SQS timeout can be a bit longer,
// but I see no point in SQS waiting for a Lambda to report back, that was already forcefully terminated
// due to a timeout.
const timeoutToSuccessfullyHandleMessage = Duration.minutes(3);

export class DataIngesterUpdater extends Construct {
  public fnStart: TypescriptFunction;
  private churnedQueue: Queue;
  private sourcesQueue: Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.createSourcesQueue();
    this.createChurnedQueue();
    this.createCronBasedInitiatorLambda();
    this.createSourcesQueueConsumerLambda();
    this.createChurnedQueueConsumerLambda();
  }

  private createSourcesQueue() {
    this.sourcesQueue = new Queue(this, "SourcesQueue", {
      removalPolicy: RemovalPolicy.DESTROY,
      visibilityTimeout: timeoutToSuccessfullyHandleMessage,
    });
  }

  private createChurnedQueue() {
    this.churnedQueue = new Queue(this, "ChurnedQueue", {
      removalPolicy: RemovalPolicy.DESTROY,
      visibilityTimeout: timeoutToSuccessfullyHandleMessage,
    });
  }

  private createCronBasedInitiatorLambda() {
    // Lambda that collects all Audience members that need to refresh their Churned status regularly
    // and push them to the SQS queue for async parallel processing
    this.fnStart = new TypescriptFunction(this, "DataIngesterUpdater", {
      entry: path.resolve(__dirname, "DataIngesterUpdater.start.lambda.ts"),
      timeout: Duration.minutes(15), // scraping all Audience members from DB can take a while
      description: `Scheduled DataIngesterUpdater to execute both audience fetcher and churned users updates`,
      environment: {
        SQS_SOURCES_QUEUE_URL: this.sourcesQueue.queueUrl,
        SQS_CHURNED_QUEUE_URL: this.churnedQueue.queueUrl,
      },
    });
    this.fnStart.addToRolePolicy(
      new PolicyStatement({
        actions: ["es:ESHttp*"],
        resources: ["*"],
      })
    );
    this.sourcesQueue.grantSendMessages(this.fnStart);
    this.churnedQueue.grantSendMessages(this.fnStart);

    // In dev mode, you can always run the Lambda from the AWS console,
    // so don't rely/wait on this cron for testing
    if (envName() === "production" || envName() === "staging") {
      const schedule = Schedule.rate(Duration.hours(4));
      const rule = new Rule(this, "Rule", {
        schedule,
      });
      rule.addTarget(new LambdaFunction(this.fnStart));
    }
  }

  private createSourcesQueueConsumerLambda() {
    const fnSourceConsumer = new TypescriptFunction(this, "SourcesConsumer", {
      entry: path.resolve(__dirname, "Sources.consumer.lambda.ts"),

      // Scraping all NFTs of a wallet from Covalent can take a while
      // This value needs to be synchronized with the SQS visibility timeout,
      // because if the Lambda keeps running for longer than the visibility timeout
      // the SQS will assume the message was not successfully delivered and will deliver
      // it to another consumer (another Lambda instance), and this Lambda will keep running wastefully,
      // so it's better to just terminate it.
      timeout: timeoutToSuccessfullyHandleMessage,

      // Maximize memory for this background Lambda, for two reasons:
      // 1. More memory means better networking for the Lambda
      // 2. Fatter wallets return 100MB of transactions from Covalent and these require significantly
      // higher memory to parse raw even logs from and compute results
      memorySize: 1024 * 3,

      description: `Consumes messages from the SQS queue and manage each source`,
      environment: {
        SQS_SOURCES_QUEUE_URL: this.sourcesQueue.queueUrl,
      },

      // Keep the Node version 18+ here, because the Covalent SDK seems to
      // have issues with the `for await` loop in older versions.
      // It just silently returns no transactions, which is hard to debug
      runtime: Runtime.NODEJS_18_X,
    });

    fnSourceConsumer.addToRolePolicy(
      new PolicyStatement({
        actions: ["es:ESHttp*", "dynamodb:BatchWriteItem"],
        resources: ["*"],
      })
    );

    this.sourcesQueue.grantConsumeMessages(fnSourceConsumer);

    fnSourceConsumer.addEventSource(
      new SqsEventSource(this.sourcesQueue, {
        // Process up to this number of sources in parallel
        maxConcurrency: 20,
        batchSize: 10,
      })
    );
  }

  private createChurnedQueueConsumerLambda() {
    const fnChurnedConsumer = new TypescriptFunction(
      this,
      "ChurnedUsersConsumer",
      {
        entry: path.resolve(__dirname, "ChurnedUsers.consumer.lambda.ts"),

        // Scraping all NFTs of a wallet from Covalent can take a while
        // This value needs to be synchronized with the SQS visibility timeout,
        // because if the Lambda keeps running for longer than the visibility timeout
        // the SQS will assume the message was not successfully delivered and will deliver
        // it to another consumer (another Lambda instance), and this Lambda will keep running wastefully,
        // so it's better to just terminate it.
        timeout: timeoutToSuccessfullyHandleMessage,

        // Maximize memory for this background Lambda, for two reasons:
        // 1. More memory means better networking for the Lambda
        // 2. Fatter wallets return 100MB of transactions from Covalent and these require significantly
        // higher memory to parse raw even logs from and compute results
        memorySize: 1024 * 3,

        description: `Consumes messages from the SQS queue and updates Churned/Not Churned status of an audience member`,
        environment: {
          SQS_CHURNED_QUEUE_URL: this.churnedQueue.queueUrl,
        },

        // Keep the Node version 18+ here, because the Covalent SDK seems to
        // have issues with the `for await` loop in older versions.
        // It just silently returns no transactions, which is hard to debug
        runtime: Runtime.NODEJS_18_X,
      }
    );

    this.churnedQueue.grantConsumeMessages(fnChurnedConsumer);

    fnChurnedConsumer.addToRolePolicy(
      new PolicyStatement({
        actions: ["es:ESHttp*", "dynamodb:BatchWriteItem"],
        resources: ["*"],
      })
    );

    fnChurnedConsumer.addEventSource(
      new SqsEventSource(this.churnedQueue, {
        // Process up to this number of audience members in parallel
        maxConcurrency: 20,

        // Every Lambda invoked will receive an array of one wallet to process (single responsibility).
        // Helps to prevent "whale wallets" (that take 1+ minute to process) from keeping
        // the same Lambda occupied where these smaller wallets can fire off their individual
        // Lambda invocation, in parallel, and get processed quicker
        batchSize: 1,
      })
    );
  }
}
