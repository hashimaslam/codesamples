import { Construct } from "constructs";
import {
  IAuthorizer,
  IRestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";

import * as path from "path";
import { Arn, Duration, Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { TypescriptFunction } from "../../../../../shared/constructs/TypescriptFunction";

import { envName } from "../../../../../../bin/envName";

export class GetConfiguration extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    const fn = new TypescriptFunction(this, "GetConfigurationForTenant", {
      entry: path.resolve(__dirname, "GetConfiguration.lambda.ts"),
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:Query"],
          resources: [
            Arn.format(
              {
                service: "dynamodb",
                resource: "table",
                resourceName: `${envName()}-db-TeamMembers*`,
              },
              Stack.of(this)
            ),
          ],
        }),
        new PolicyStatement({
          actions: ["dynamodb:GetItem"],
          resources: [
            Arn.format(
              {
                service: "dynamodb",
                resource: "table",
                resourceName: `${envName()}-db-Teams*`,
              },
              Stack.of(this)
            ),
          ],
        }),
        new PolicyStatement({
          actions: ["dynamodb:GetItem"],
          resources: [
            Arn.format(
              {
                service: "dynamodb",
                resource: "table",
                resourceName: `${envName()}-db-TeamConfigurations*`,
              },
              Stack.of(this)
            ),
          ],
        }),
        new PolicyStatement({
          actions: ["s3:Get*"],
          resources: ["*"],
        }),
      ],
      timeout: Duration.seconds(10),
    });
    props.api.root
      .resourceForPath("/tenants/{id}")
      .addMethod("GET", new LambdaIntegration(fn), {
        authorizer: this.node.getContext("authorizer") as IAuthorizer,
      });
  }
}
