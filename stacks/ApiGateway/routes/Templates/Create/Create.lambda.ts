import { middlewares } from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { createNewTevplate } from "../utils/Tevplates";
import { Tevplate } from "../utils/Tevplates.types";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";

interface Request extends APIGatewayProxyEvent {}

export const handler1 = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return {
      statusCode: 401,
      body: {
        error: "Sorry, you are not an admin/editor. You cannot create tevplate",
      },
    };
  }

  const { name, description, attributes } = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as Tevplate;

  if (!name) {
    return {
      statusCode: 400,
      body: { error: "Invalid 'name' provided" },
    };
  }

  if (!attributes || attributes.length === 0) {
    return {
      statusCode: 400,
      body: { error: "You should to provide almost one attribute" },
    };
  }

  const id = uuid();
  const new_tevplate: Tevplate = {
    id: id,
    team_id: team.teamId,
    name: name,
    description: description,
    attributes: attributes,
    created_time: Math.floor(Date.now() / 1000).toString(),
    user_id: userId,
  };

  await createNewTevplate(new_tevplate);

  return { statusCode: 200, body: { id: id } };
};

export const handler: any = middlewares(handler1);
