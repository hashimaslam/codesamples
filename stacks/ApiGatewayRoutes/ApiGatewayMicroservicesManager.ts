import { App, Environment, Stack } from "aws-cdk-lib";
import { IAuthorizer, IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Auth } from "../ApiGateway/routes/Auth/Auth";
import { WalletConnections } from "../ApiGateway/routes/WalletConnections/WalletConnections";
import { Collections } from "../ApiGateway/routes/Collections/Collections";
import { Tokens } from "../ApiGateway/routes/Tokens/Tokens";
import { Audiences } from "../ApiGateway/routes/Audiences/Audiences";
import { Tenants } from "../ApiGateway/routes/Tenants/Tenants";
import { Users } from "../ApiGateway/routes/Users/Users";
import { Storage } from "../ApiGateway/routes/Storage/Storage";
import { Tevplates } from "../ApiGateway/routes/Tevplates/Tevplates";
import { Statistics } from "../ApiGateway/routes/Statistics/Statistics";
import { AllowLists } from "../ApiGateway/routes/AllowLists/AllowLists";
import { Sources } from "../ApiGateway/routes/Sources/Sources";
import { Jobs } from "../ApiGateway/routes/Jobs/Jobs";
import { ApiGatewayMicroserviceStack } from "./ApiGatewayMicroserviceStack";
import { Construct } from "constructs";
import { Segments } from "../ApiGateway/routes/Segments/Segments";
import { Churned } from "../ApiGateway/routes/Churned/Churned";
import { Forms } from "../ApiGateway/routes/Forms/Forms";
import { Analytics } from "../ApiGateway/routes/Analytics/Analytics";
import { Airdrops } from "../ApiGateway/routes/Airdrops/Airdrops";
interface ApiGatewayMicroservicesManagerProps {
  env: Environment;
  api: IRestApi;
  authorizer: IAuthorizer;
}

export class ApiGatewayMicroservicesManager extends Construct {
  private readonly stackPrefix: string;

  microserviceStacks: Stack[] = [];

  constructor(
    public app: App,
    public id: string,
    public props: ApiGatewayMicroservicesManagerProps
  ) {
    super(app, id);

    this.stackPrefix = this.id;

    const microserviceStackAuth = this.getMicroserviceStack("auth");
    new Auth(microserviceStackAuth, "Auth", {
      api: microserviceStackAuth.api,
    });

    const microserviceWalletConnections =
      this.getMicroserviceStack("wallet-connections");
    new WalletConnections(microserviceWalletConnections, "WalletConnections", {
      api: microserviceWalletConnections.api,
    });

    const microserviceCollections = this.getMicroserviceStack("collections");
    new Collections(microserviceCollections, "Collections", {
      api: microserviceCollections.api,
    });

    const microserviceTokens = this.getMicroserviceStack("tokens");
    new Tokens(microserviceTokens, "Tokens", {
      api: microserviceTokens.api,
    });

    const microserviceAnalytics = this.getMicroserviceStack("Analytics");
    new Analytics(microserviceAnalytics, "Analytics", {
      api: microserviceAnalytics.api,
    });

    const microserviceAudiences = this.getMicroserviceStack("audiences");
    new Audiences(microserviceAudiences, "Audiences", {
      api: microserviceAudiences.api,
    });

    const microserviceChurned = this.getMicroserviceStack("churned");
    new Churned(microserviceChurned, "Churned", {
      api: microserviceChurned.api,
    });

    const microserviceForms = this.getMicroserviceStack("forms");
    new Forms(microserviceForms, "Forms", {
      api: microserviceForms.api,
    });

    const microserviceTenants = this.getMicroserviceStack("tenants");
    new Tenants(microserviceTenants, "Tenants", {
      api: microserviceTenants.api,
    });

    const microserviceUsers = this.getMicroserviceStack("users");
    new Users(microserviceUsers, "Users", {
      api: microserviceUsers.api,
    });

    const microserviceStorage = this.getMicroserviceStack("storage");
    new Storage(microserviceStorage, "Storage", {
      api: microserviceStorage.api,
    });

    const microserviceTevplates = this.getMicroserviceStack("tevplates");
    new Tevplates(microserviceTevplates, "Tevplates", {
      api: microserviceTevplates.api,
    });

    const microserviceStatistics = this.getMicroserviceStack("statistics");
    new Statistics(microserviceStatistics, "Statistics", {
      api: microserviceStatistics.api,
    });

    const microserviceAllowLists = this.getMicroserviceStack("allowlists");
    new AllowLists(microserviceAllowLists, "AllowLists", {
      api: microserviceAllowLists.api,
    });

    const microserviceSources = this.getMicroserviceStack("sources");
    new Sources(microserviceSources, "Sources", {
      api: microserviceSources.api,
    });

    const microserviceJobs = this.getMicroserviceStack("jobs");
    new Jobs(microserviceJobs, "Jobs", {
      api: microserviceJobs.api,
    });

    const microserviceSegments = this.getMicroserviceStack("segments");
    new Segments(microserviceSegments, "Segments", {
      api: microserviceSegments.api,
    });
    const microserviceAirdrops = this.getMicroserviceStack("airdrops");
    new Airdrops(microserviceAirdrops, "Airdrops", {
      api: microserviceAirdrops.api,
    });
  }

  private getMicroserviceStack(id: string) {
    const microserviceStack = new ApiGatewayMicroserviceStack(
      this.app,
      `${this.stackPrefix}-${id}`,
      {
        env: this.props.env,
        authorizer: this.props.authorizer,
        restApiId: this.props.api.restApiId,
        restApiRootResourceId: this.props.api.restApiRootResourceId,
      }
    );

    // Push this stack to a list, which will be later passed to the "Deployment" stack, so that stack is always
    // invalidated/recreated after the stacks in this list are deployed
    this.microserviceStacks.push(microserviceStack);
    return microserviceStack;
  }
}
