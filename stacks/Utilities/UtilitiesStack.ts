import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { TeamPurger } from "./TeamPurger/TeamPurger";
import { AudiencesPurger } from "./AudiencesPurger/AudiencesPurger";
export class UtilitiesStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Utility Lambda for purging a team by ID
    new TeamPurger(this, "TeamPurger");
    // Utility Lambda for purging Audiences and related table data
    new AudiencesPurger(this, "AudiencesPurger");
  }
}
