import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Domain as OpenSearchDomain,
  EngineVersion,
  IDomain,
} from "aws-cdk-lib/aws-opensearchservice";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { envName } from "../../../bin/envName";

export class OpenSearch extends Stack {
  domain: IDomain;

  constructor(scope: Construct, id: string, private props: StackProps) {
    super(scope, id, props);

    this.createOrImportDomain();
  }

  private createOrImportDomain() {
    const env = envName();
    this.domain = this._resolveDomain(env);
    this._storeDomainReferencesToParameterStore();
  }

  private _storeDomainReferencesToParameterStore() {
    const env = envName();
    new StringParameter(this.domain, "StringParameter-ARN", {
      stringValue: this.domain.domainArn,
      parameterName: `/${env}/opensearch/arn`,
    });
    new StringParameter(this.domain, "StringParameter-DomainEndpoint", {
      stringValue: this.domain.domainEndpoint,
      parameterName: `/${env}/opensearch/domain-endpoint`,
    });
  }

  private _resolveDomain(env: string) {
    // Staging creates its own OpenSearch domain
    if (env === "staging") {
      return new OpenSearchDomain(this, "Domain", {
        version: EngineVersion.OPENSEARCH_2_7,
        removalPolicy: RemovalPolicy.DESTROY,
      });
    }

    const IMPORT_DOMAIN_FROM_THIS_ENVIRONMENT = "staging";

    // All other environments (e.g. individual developers) import the domain created by Staging and reuse it
    return OpenSearchDomain.fromDomainAttributes(this, "Domain", {
      domainArn: StringParameter.fromStringParameterName(
        this,
        "StringParameter-ARN",
        `/${IMPORT_DOMAIN_FROM_THIS_ENVIRONMENT}/opensearch/arn`
      ).stringValue,
      domainEndpoint: StringParameter.fromStringParameterName(
        this,
        "StringParameter-DomainEndpoint",
        `/${IMPORT_DOMAIN_FROM_THIS_ENVIRONMENT}/opensearch/domain-endpoint`
      ).stringValue,
    });
  }
}
