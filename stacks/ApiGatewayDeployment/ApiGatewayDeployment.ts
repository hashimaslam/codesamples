import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AccessLogFormat,
  Deployment,
  IRestApi,
  LogGroupLogDestination,
  MethodLoggingLevel,
  RestApi,
  Stage,
} from "aws-cdk-lib/aws-apigateway";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";

import { envName } from "../../../bin/envName";

interface ApiGatewayDeploymentProps extends StackProps {
  api: IRestApi;
}

/**
 * This stack is the last stack in the API Gateway deployment process, after the API GW, the routes,
 * and the authorizer have been created in separate stacks. If we don't create the Deployment+Stage after
 * the routes are added, these routes are not accessible
 * TODO: One possible optimization for the future is to make the Deployment logical ID computation deterministic and
 * TODO: tightly coupled on the Logical IDs of all routes that were added in previous deployed Stacks, but this is
 * TODO: not trivial to do, and it's not clear if it's worth the effort, considering that recreating the Deployment
 * TODO: construct by CloudFormation takes only a few seconds
 */
export class ApiGatewayDeployment extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayDeploymentProps) {
    super(scope, id, props);

    const api = RestApi.fromRestApiAttributes(this, "ApiGateway", {
      restApiId: props.api.restApiId,
      rootResourceId: props.api.restApiRootResourceId,
    });

    const logGroup = new LogGroup(this, "LogGroup", {
      // Purge logs faster on development environments
      retention:
        envName() === "staging"
          ? RetentionDays.ONE_YEAR
          : RetentionDays.TWO_WEEKS,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const deployment = new Deployment(this, "Deployment", {
      api,
      retainDeployments: true,
      description: "Deployment for the API Gateway",
    });
    deployment.addToLogicalId(new Date().toISOString());

    new Stage(this, "Stage", {
      stageName: "prod",
      deployment,
      loggingLevel: MethodLoggingLevel.INFO,
      tracingEnabled: true,
      dataTraceEnabled: true,
      accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
      accessLogDestination: new LogGroupLogDestination(logGroup),
      throttlingBurstLimit: 150,
      throttlingRateLimit: 50,
    });
  }
}
