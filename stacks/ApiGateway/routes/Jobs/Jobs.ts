import { Construct } from "constructs";
import { Get } from "./Get/Get";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Jobs extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Get(this, "Get", { api: props.api });
  }
}
