import { Construct } from "constructs";
import { Connect } from "./Connect/Connect";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class WalletConnections extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Connect(this, "Connect", {
      api: props.api,
    });
  }
}
