import { Construct } from "constructs";

import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../shared/constructs/TypescriptFunction";

export class TeamPurger extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "TeamPurger.lambda.ts", {
      entry: path.resolve(__dirname, "TeamPurger.lambda.ts"),
      timeout: Duration.seconds(90),
      description:
        "Utility Lambda for purging a team by ID. Can only be called manually from the AWS console",
    });
    fn.addToRolePolicy(
      new PolicyStatement({
        actions: ["*"],
        resources: ["*"],
      })
    );
  }
}
