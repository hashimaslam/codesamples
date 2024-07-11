import { Construct } from "constructs";
import { ValidateCSV } from "./ValidateCSV/ValidateCSV";
import { ValidateZip } from "./ValidateZip/ValidateZip";
import { StartJob } from "./Start/StartJob";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Bulk extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new StartJob(this, "StartJob", { api: props.api });
    new ValidateCSV(this, "ValidateCSV", { api: props.api });
    new ValidateZip(this, "ValidateZip", { api: props.api });
  }
}
