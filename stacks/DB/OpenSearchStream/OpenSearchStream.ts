import { Construct } from "constructs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Duration } from "aws-cdk-lib";
import * as path from "path";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";

interface OpenSearchStreamProps {
  /**
   * The table to be streamed/synchronized to an OpenSearch index
   */
  table: ITable;

  /**
   * The field within each document which will be used as the primary key for documents, indexed to OpenSearch
   */
  pkField: string;
}

export class OpenSearchStream extends Construct {
  constructor(
    scope: Construct,
    private id: string,
    private props: OpenSearchStreamProps
  ) {
    super(scope, id);

    if (this.props.table.tableStreamArn) {
      // Annotations.of(this).addError(`OpenSearchStream: table ${this.props.table.tableName} must have a stream enabled`)
      // return;
    }

    const fnStreamProcessor = new TypescriptFunction(
      this,
      `${id}-OpenSearchStream.lambda.ts`,
      {
        entry: path.resolve(__dirname, "OpenSearchStream.lambda.ts"),
        timeout: Duration.seconds(60),
        description: `Lambda that streams changes to the ${this.props.table.tableName} table to OpenSearch,`,
        environment: {
          OPENSEARCH_INDEX_NAME: this.props.table.tableName,
          PK_FIELD: this.props.pkField,
        },
      }
    );

    fnStreamProcessor.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );

    // DynamoDB stream will trigger the Lambda function
    fnStreamProcessor.addEventSource(
      new DynamoEventSource(this.props.table, {
        bisectBatchOnError: true,
        reportBatchItemFailures: true,
        batchSize: 10000,
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );

    this.createIndexRecreateLambda();
  }

  private createIndexRecreateLambda() {
    const fnReindex = new TypescriptFunction(
      this,
      `${this.id}-OpenSearchStream-reindex.lambda.ts`,
      {
        entry: path.resolve(__dirname, "OpenSearchStream-reindex.lambda.ts"),
        timeout: Duration.minutes(15), // Hard limit by Lambda
        description: `Reindex ${this.props.table.tableName} Lambda that drops the ES index, fetches ALL records from the DynamoDB table and reindex them to ES. WARNING: Could cause ES downtime during indexing`,
        environment: {
          SOURCE_TABLE_NAME: this.props.table.tableName,
          OPENSEARCH_INDEX_NAME: this.props.table.tableName,
          PK_FIELD: this.props.pkField,
        },
      }
    );

    fnReindex.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );
  }
}
