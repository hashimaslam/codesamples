import { Construct } from "constructs";

import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";

export class CollectionCascadeUpdater extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps,
    tableCollections: Table
  ) {
    super(scope, id, props);

    const fn = new TypescriptFunction(this, "CollectionCascadeUpdater", {
      entry: path.resolve(__dirname, "CollectionCascadeUpdater.lambda.ts"),
      timeout: Duration.seconds(90),
      initialPolicy: [
        new PolicyStatement({
          actions: [
            "dynamodb:GetItem",
            "dynamodb:UpdateItem",
            "dynamodb:Query",
          ],
          resources: ["*"],
        }),
      ],
    });
    fn.addEventSource(
      new DynamoEventSource(tableCollections, {
        startingPosition: StartingPosition.TRIM_HORIZON,
        batchSize: 5,
      })
    );
  }
}
