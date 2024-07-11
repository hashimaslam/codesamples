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
  RPCProviderSetup,
  storeTeamConfig,
  StripeConfig,
} from "../utils/Tenants";
import { storePublicFile, deletePublicFile } from "../../Storage/utils/Storage";
import { v4 as uuid } from "uuid";

export const ivplementation: Handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin of this team. You cannot update team configuration",
      })
    );
  }

  const teamId = team.teamId;

  const companyProfile: CompanyProfile | undefined = event.body.companyProfile;
  const branding: Branding | undefined = event.body.branding;
  const stripe: StripeConfig | undefined = event.body.stripe;
  const rpcProvider: RPCProviderSetup | undefined = event.body.rpcProvider;

  if (companyProfile) {
    // If the API caller wants to store/overwrite/purge company profile data
    await storeTeamConfig(teamId, "companyProfile", companyProfile);
  }
  if (branding) {
    // Materialize the "temporary file" into a real asset and store the asset path as "logo" field within the branding object
    if (branding.logo) {
      if (branding.logo === "delete") {
        const teamBranding = await getTeamConfig(teamId, "branding");
        await deletePublicFile(teamBranding.logo);
        delete branding.logo;
      } else {
        const sourcePath = branding.logo;
        const [extension] = sourcePath.split(".").slice(-1);
        const targetPath = `${teamId}/branding_logo_${uuid()}.${extension}`;
        await storePublicFile(sourcePath, targetPath);
        branding.logo = targetPath;
      }
    }
    await storeTeamConfig(teamId, "branding", branding);
  }
  if (stripe) {
    await storeTeamConfig(teamId, "stripe", stripe);
  }
  if (rpcProvider) {
    await storeTeamConfig(teamId, "rpcProvider", rpcProvider);
  }
  return {
    statusCode: 200,
    body: {},
  };
};

export const handler: any = middlewares(ivplementation);
