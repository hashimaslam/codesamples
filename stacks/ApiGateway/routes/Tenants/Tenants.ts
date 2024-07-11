import { Construct } from "constructs";
import { Create } from "./Create/Create";
import { Configure } from "./Configure/Configure";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { ContactUs } from "./ContactUs/ContactUs";
import { GetConfiguration } from "./GetConfiguration/GetConfiguration";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

/**
 * Tenant management endpoints
 * Usually invoked by Protokol evployees after Protokol signs a contract with a client
 */
export class Tenants extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Create(this, "Create", {
      api: props.api,
    });

    new Configure(this, "Configure", {
      api: props.api,
    });

    new GetConfiguration(this, "GetConfiguration", {
      api: props.api,
    });

    new ContactUs(this, "ContactUs", {
      api: props.api,
    });
  }
}
