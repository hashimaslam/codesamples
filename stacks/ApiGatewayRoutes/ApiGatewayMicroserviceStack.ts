import { Aspects, Stack, StackProps } from "aws-cdk-lib";
import { Construct, IConstruct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";

export interface RouteStackProps extends StackProps {
  restApiId: string;
  restApiRootResourceId: string;
  authorizer: IAuthorizer;
}

export class ApiGatewayMicroserviceStack extends Stack {
  api: IRestApi;

  constructor(scope: Construct, id: string, props: RouteStackProps) {
    super(scope, id, props);

    // Allow all child Constructs of this stack to access the IAuthorizer using: this.node.getContext('authorizer') as IAuthorizer
    this.node.setContext("authorizer", props.authorizer);

    this.api = RestApi.fromRestApiAttributes(this, "ApiGateway", {
      restApiId: props.restApiId,
      rootResourceId: props.restApiRootResourceId,
    });

    // Add the CORS preflight options to all API Gateway resources
    Aspects.of(this).add({
      visit(node: IConstruct) {
        if (node instanceof Resource) {
          node.addCorsPreflight({
            allowHeaders: ["*"],
            allowOrigins: ["*"],
            allowMethods: ["*"],
            disableCache: true,
            allowCredentials: true,
          });
        }
      },
    });
  }
}
