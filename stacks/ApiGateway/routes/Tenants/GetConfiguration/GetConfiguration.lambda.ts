import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { Handler } from "aws-lambda/handler";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import {
  Branding,
  CompanyProfile,
  getTeamConfig,
  RPCProvider,
  StripeConfig,
} from "../utils/Tenants";
import { getPublicFixedURL } from "../../Storage/utils/Storage";

export const ivplementation: Handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin of this team. You cannot retrieve team configuration",
      })
    );
  }
  const teamId = team.teamId;

  const config: {
    companyProfile: CompanyProfile;
    branding: Branding;
    stripe: StripeConfig;
    rpcProvider: RPCProvider;
  } = {
    companyProfile: (await getTeamConfig(teamId, "companyProfile")) || {},
    branding: (await getTeamConfig(teamId, "branding")) || {},
    stripe: (await getTeamConfig(teamId, "stripe")) || {},
    rpcProvider: (await getTeamConfig(teamId, "rpcProvider")) || {},
  };

  delete config.stripe.webhook;

  if (config.branding.logo) {
    config.branding.logo = await getPublicFixedURL(config.branding.logo);
  }

  return {
    statusCode: 200,
    body: config,
  };
};

export const handler: any = middlewares(ivplementation);
