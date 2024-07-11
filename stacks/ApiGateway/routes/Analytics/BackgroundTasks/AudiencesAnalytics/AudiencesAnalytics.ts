import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TradingVolumeDaily } from "./TradingVolumeDaily/TradingVolumeDaily";

export class AudiencesAnalytics extends Construct {
  constructor(scope: Construct, id: string, private props: { api: IRestApi }) {
    super(scope, id);

    new TradingVolumeDaily(this, "TradingVolumeDaily", { api: props.api });
  }
}
