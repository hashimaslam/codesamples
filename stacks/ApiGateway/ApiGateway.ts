import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CognitoUserPoolsAuthorizer,
  IAuthorizer,
  IResource,
  IRestApi,
  MockIntegration,
  ResponseType,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { AuthorizedRestApi } from "./AuthorizedRestApi";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

import { envName } from "../../../bin/envName";

interface ApiGatewayProps extends StackProps {
  userPool: IUserPool;
}

export class ApiGateway extends Stack {
  api: IRestApi;
  apiRootResource: IResource;
  authorizer: IAuthorizer;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id, props);

    this.authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CognitoUserPoolsAuthorizer",
      {
        resultsCacheTtl: Duration.seconds(0),
        cognitoUserPools: [props.userPool],
      }
    );
    this.exportValue(this.authorizer.authorizerId);

    const api = new AuthorizedRestApi(this, "AuthorizedRestApi", {
      description: `API GW for environment: ${process.env.AWS_ENV}`,
      authorizer: this.authorizer,
      defaultCorsPreflightOptions: {
        allowHeaders: ["*"],
        allowMethods: ["*"],
        allowOrigins: ["*"],
        disableCache: true,
        allowCredentials: false,
      },
      deployOptions: {
        // Rename the stage to something that is not used, so we can free the name called "prod" for the production stage
        // which we'll create in a separate stack, which is created after the individual "route attachment" stacks are created
        stageName: "use_the_prod_stage_only",
      },
    });
    this.api = api;
    this.apiRootResource = api.root;

    // Allow other parts of the app (e.g. CI) to easily resolve the API GW URL for a given environment
    new StringParameter(this, "StringParameter", {
      parameterName: `/nft-governor/${envName()}/api/url`,
      stringValue: api.url,
    });

    // Whenever the frontend makes a call to one of the "authenticated" endpoints, the browser first sends
    // a request to the OPTIONS method of that same endpoint. API Gateway will, by default, return a 401 unauthorized
    // error for endpoints that have an authorizer configured
    api.addGatewayResponse("UNAUTHORIZED", {
      statusCode: "401",
      type: ResponseType.UNAUTHORIZED,
      responseHeaders: {
        "Access-Control-Allow-Headers": "'*'",
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Methods": "'*'",
      },
    });

    // Whenever the OPTIONS method returns a 500 error for some reason, the frontend will mask the errors as a CORS
    // error rather than revealing that it's a 500 Internal Server Error. The hack below avoids that
    api.addGatewayResponse("INTERNAL_SERVER_ERROR", {
      statusCode: "502",
      type: ResponseType.DEFAULT_5XX,
      responseHeaders: {
        "Access-Control-Allow-Headers": "'*'",
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Methods": "'*'",
      },
    });

    // API Gateway requires at least one resource, which uses the Authorizer
    // Otherwise the Authorizer fails to be created
    // For this reason, we create some "mock" endpoint here with the Authorizer attached,
    // so its creation can succeed
    api.root
      .resourceForPath("/ping")
      .addMethod("GET", new MockIntegration(), { authorizer: this.authorizer });
  }
}
