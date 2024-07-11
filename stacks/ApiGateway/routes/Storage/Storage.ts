import { Construct } from "constructs";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { GetPresignedUrl } from "./GetPresignedUrl/GetPresignedUrl";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Storage extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new GetPresignedUrl(this, "GetPresignedUrl", {
      api: props.api,
    });
  }
}
