import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export class CognitoStack extends Stack {
  userPool: UserPool;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.userPool = new UserPool(this, "UserPool", {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Allow Lambdas to resolve a reference to the UserPool at runtime, without enforcing a CloudFormation/CDK deploy-time dependency
    new StringParameter(this.userPool, "StringParameter-userPoolId", {
      stringValue: this.userPool.userPoolId,
      parameterName: `/nft-governor/${process.env.AWS_ENV}/cognito/userPoolId`,
    });

    // Create a UserPool client, which allows Lambdas to authenticate on behalf of users
    const client = this.userPool.addClient("default", {
      authFlows: {
        adminUserPassword: true,
      },
      idTokenValidity: Duration.days(1),
    });

    // Allow Lambdas to resolve a reference to the UserPool at runtime, without enforcing a CloudFormation/CDK deploy-time dependency
    new StringParameter(client, "StringParameter-userPoolClientId", {
      stringValue: client.userPoolClientId,
      parameterName: `/nft-governor/${process.env.AWS_ENV}/cognito/userPoolClientId`,
    });
  }
}
