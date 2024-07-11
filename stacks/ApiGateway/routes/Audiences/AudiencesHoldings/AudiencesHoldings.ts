import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { List } from "./List/List";

export class AudiencesHoldings extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new List(this, "List", {
      api: props.api,
    });
  }
}
