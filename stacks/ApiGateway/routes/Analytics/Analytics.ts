import { Construct } from "constructs";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Get } from "./Get/Get";
import { BackgroundTasks } from "./BackgroundTasks/BackgroundTasks";

export class Analytics extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Get(this, "Get", { api: props.api });

    new BackgroundTasks(this, "BackgroundTasks", { api: props.api });
  }
}
