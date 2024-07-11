import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import { SegmentCounter } from "./SegmentCounter/SegmentCounter";
import { DataIngester } from "./DataIngester/DataIngester";
import { DataIngesterUpdater } from "./DataIngesterUpdater/DataIngesterUpdater";
import { TxWatchDogStack } from "./TxWatchDog/TxWatchDogStack";

export class Daemons extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    new TxWatchDogStack(this, "TxWatchDogStack");
    new DataIngester(this, "DataIngester");
    new SegmentCounter(this, "SegmentCounter");
    new DataIngesterUpdater(this, "DataIngesterUpdater");
  }
}
