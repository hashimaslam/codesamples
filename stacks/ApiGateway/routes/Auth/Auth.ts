import { Construct } from "constructs";
import { Login } from "./Login/Login";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { ResetPassword } from "./ResetPassword/ResetPassword";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Auth extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Login(this, "Login", {
      api: props.api,
    });

    new ResetPassword(this, "ResetPassword", {
      api: props.api,
    });
  }
}
