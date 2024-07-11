import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { Dashboard } from "./Dashboard/Dashboard";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Statistics extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Dashboard(this, "Dashboard", {
      api: this.props.api,
    });
  }
}
