import { IAuthorizer, RestApi, RestApiProps } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { Size } from "aws-cdk-lib";

interface Props extends RestApiProps {
  authorizer: IAuthorizer;
}

export class AuthorizedRestApi extends RestApi {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, {
      ...props,
      minCompressionSize: Size.bytes(0),
    });
  }
}
