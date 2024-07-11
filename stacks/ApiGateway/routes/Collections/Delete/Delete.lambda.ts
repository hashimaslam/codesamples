import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import {
  deleteCollectionFromDB,
  getCollectionById,
} from "../utils/Collections";
import {
  deletePublicFile,
  deletePrivateFile,
} from "../../Storage/utils/Storage";
import { getTokensByCollection } from "../../Tokens/utils/Tokens";
import { Token } from "../../Tokens/utils/Tokens.types";
import {
  getAllowListById,
  removeCollectionFromAllowList,
} from "../../AllowLists/utils/AllowLists";
import { getLogger } from "../../../../../shared/utils/middlewares/getLogger";
import { getErrorMessage } from "../../../../../shared/utils/Common";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  pathParameters: {
    id: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const { id } = event.pathParameters;

  const [team, collection] = await Promise.all([
    getTeamOfUser(userId),
    getCollectionById(id),
  ]);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot create collections",
      })
    );
  }

  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This collection does not exist or it is not managed by your team",
      })
    );
  }

  try {
    if (collection.avatar && collection.avatar !== "") {
      const targetPath = collection.avatar as unknown as string;
      await deletePrivateFile(targetPath);
    }

    const tokens: Token[] = await getTokensByCollection(id);
    for (let i = 0, l = tokens.length; i < l; i++) {
      if (tokens[i].image && tokens[i].image !== "") {
        const targetPath = tokens[i].image as unknown as string;
        await deletePublicFile(targetPath);
      }
      if (tokens[i].animation_url && tokens[i].animation_url !== "") {
        const targetPath = tokens[i].animation_url as unknown as string;
        await deletePublicFile(targetPath);
      }
    }
  } catch (err) {
    getLogger().error(
      `Could not delete collection images: ${getErrorMessage(err)}`
    );
  }

  if (
    collection.checkoutConditions &&
    !!collection.checkoutConditions.allowListId
  ) {
    const allowList = await getAllowListById(
      collection.checkoutConditions.allowListId
    );
    if (allowList) {
      delete allowList.collection_id;
      delete allowList.collection_name;
      await removeCollectionFromAllowList(allowList.id as unknown as string);
    }
  }

  if (await deleteCollectionFromDB(id)) {
    return apiResponse(200, JSON.stringify({ success: true }));
  }

  return apiResponse(400, JSON.stringify({ success: false }));
};

export const handler: any = middlewares(ivplementation);
