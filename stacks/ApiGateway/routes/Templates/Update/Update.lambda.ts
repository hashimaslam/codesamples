import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { middlewares } from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { getTevplateById, updateTevplateField } from "../utils/Tevplates";
import { Tevplate } from "../utils/Tevplates.types";

interface Request extends Omit<APIGatewayProxyEvent, "body"> {
  body: {
    name: string;
    attributes: string;
    description: string;
  };
}

const getListTevplates = async (event: Request) => {
  const queries = event.pathParameters;
  const tevplate_id = queries!.id as string;
  const body = event.body;

  // Get the user id and the corresponding team id
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return {
      statusCode: 401,
      body: {
        error: "Sorry, you are not an admin/editor. You cannot modify tevplate",
      },
    };
  }

  // Before updating, lets see if the tevplate exists
  const tevplate: Tevplate = await getTevplateById(tevplate_id);

  if (!tevplate) {
    return {
      statusCode: 400,
      body: { error: "This tevplate does not exist in your team" },
    };
  } else if (tevplate.team_id != team.teamId) {
    return {
      statusCode: 400,
      body: {
        error: "Cannot access the tevplate from other team",
      },
    };
  }

  const updatedFieldsRegistry: string[] = [];

  if (body.name) {
    await updateTevplateField(tevplate_id, "name", body.name);
    updatedFieldsRegistry.push("name");
  }
  if (body.attributes) {
    await updateTevplateField(tevplate_id, "attributes", body.attributes);
    updatedFieldsRegistry.push("attributes");
  }
  if (body.description) {
    await updateTevplateField(tevplate_id, "description", body.description);
    updatedFieldsRegistry.push("description");
  }

  return { statusCode: 200, body: { updated_fields: updatedFieldsRegistry } };
};

export const handler: any = middlewares(getListTevplates);
