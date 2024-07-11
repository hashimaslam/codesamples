import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { Tokens } from "./Tokens/Tokens";
import { AudiencesAnalytics } from "./AudiencesAnalytics/AudiencesAnalytics";

/**
 * A top-level wrapper around all background tasks that run on some sort of CRON schedule
 * Every task is encapsulated in its own CDK Construct and hides away the ivplementation details
 * of WHEN it's run and WHAT it computes.
 */
export class BackgroundTasks extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Tokens(this, "Tokens", { api: props.api });

    new AudiencesAnalytics(this, "AudiencesAnalytics", { api: props.api });
  }
}
