import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import * as path from "path";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";

export class AudiencesPurger extends Construct {
  constructor(scope: Construct, private id: string) {
    super(scope, id);

    this.createAudiencePurgerLambda();
  }

  private createAudiencePurgerLambda() {
    const fnPurger = new TypescriptFunction(
      this,
      `${this.id}-AudiencesPurger.lambda.ts`,
      {
        entry: path.resolve(__dirname, "AudiencesPurger.lambda.ts"),
        timeout: Duration.minutes(15), // Hard limit by Lambda
        description: `Purge Audiences, Lambda that purgue Audiences, Segments, Sources related data on tables, and also BakgroundJobErrors table.`,
        memorySize: 10240,
      }
    );

    fnPurger.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    fnPurger.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchServiceFullAccess"
      )
    );
  }
}
