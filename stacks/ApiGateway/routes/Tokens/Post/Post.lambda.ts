import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { createToken } from "../utils/Tokens";
import { v4 as uuid } from "uuid";
import { Token } from "../utils/Tokens.types";
import { storePublicFile } from "../../Storage/utils/Storage";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { Collection } from "../../Collections/utils/Collections.types";
import { getCollectionById } from "../../Collections/utils/Collections";
import { Time } from "../../../../../shared/utils/DateTime";

interface Request extends APIGatewayProxyEvent {}

const postToken = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot create tokens",
      })
    );
  }

  const token_in: Token = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as Token;

  if (!token_in.collection_id) {
    return apiResponse(
      400,
      JSON.stringify({ error: "A collection id must to be provided" })
    );
  }

  const coll_in: Collection | undefined = await getCollectionById(
    token_in.collection_id as unknown as string
  );

  if (!coll_in || coll_in.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not belong to a collection managed by your team",
      })
    );
  }

  if (!token_in.name) {
    return apiResponse(
      400,
      JSON.stringify({ error: "A token name is mandatory" })
    );
  }

  if (!token_in.image) {
    return apiResponse(
      400,
      JSON.stringify({ error: "A image token is mandatory" })
    );
  }

  if (!token_in.attributes) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Minimum attributes must to be defined" })
    );
  }

  let image_src = token_in.image;

  const sourcePath = image_src;
  const [extension] = sourcePath.split(".").slice(-1);
  const targetPath = `tokens_images/${
    token_in.collection_id
  }/${uuid()}.${extension}`;
  await storePublicFile(sourcePath, targetPath);
  image_src = targetPath;

  let animation_url = token_in.animation_url ? token_in.animation_url : "";

  if (token_in.animation_url) {
    const sourcePath = animation_url;
    const [extension] = sourcePath.split(".").slice(-1);
    const targetPath = `tokens_videos/${
      token_in.collection_id
    }/${uuid()}.${extension}`;
    await storePublicFile(sourcePath, targetPath);
    animation_url = targetPath;
  }

  const new_token: Token = {
    id: uuid(),
    collection_id: token_in.collection_id,
    collection_name: coll_in.name,
    chain_id: coll_in.chain_id as unknown as number,
    team_id: team.teamId,
    name: token_in.name,
    description: token_in.description ? token_in.description : "",
    youtube_url: token_in.youtube_url ? token_in.youtube_url : "",
    external_url: token_in.external_url ? token_in.external_url : "",
    animation_url: animation_url,
    image: image_src,
    attributes: token_in.attributes,
    mktplace_options: token_in.mktplace_options,
    mktplace_front: token_in.mktplace_front ? token_in.mktplace_front : false,
    mktplace_option: token_in.mktplace_option ? token_in.mktplace_option : "",
    minted_date: 0,
    created_at: Time.now(),
  };

  const token = await createToken(new_token);

  return apiResponse(200, JSON.stringify({ id: token.id }));
};

export const handler: any = middlewares(postToken);
