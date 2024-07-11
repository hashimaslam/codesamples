import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TypescriptFunction } from "../../../../../../../shared/constructs/TypescriptFunction";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class TradingVolumeDaily extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "TradingVolumeDailyFunction", {
      entry: path.resolve(__dirname, "TradingVolumeDaily.background.ts"),
      timeout: Duration.minutes(2),
      description:
        "Analytics: A background task that runs daily and fetches the trading volume for all the ERC721 contracts present in the system and stores them to OpenSearch for Analytics purposes",
      initialPolicy: [
        new PolicyStatement({
          actions: ["ssm:PutParameter"],
          resources: ["*"],
        }),
      ],
    });

    new Rule(this, "Rule", {
      schedule: Schedule.rate(Duration.days(1)),
      targets: [new LambdaFunction(fn)],
    });
  }
}
