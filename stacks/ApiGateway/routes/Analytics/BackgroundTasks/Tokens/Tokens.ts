import { Construct } from "constructs";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { TokensCreatedDaily } from "./TokensCreatedDaily/TokensCreatedDaily";

export class Tokens extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new TokensCreatedDaily(this, "TokensCreatedDaily", { api: props.api });
  }
}
