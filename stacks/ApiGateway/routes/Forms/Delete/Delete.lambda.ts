import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { deleteForm, getFormFromDynamoDB } from "../utils/Forms";

export const ivplementation = async (event: APIGatewayProxyEvent) => {
  const idUser = event.requestContext.authorizer?.claims.sub;
  const team = await getTeamOfUser(idUser);
  const idTeam = team.teamId;
  const id = event.pathParameters?.id as string;

  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      403,
      JSON.stringify({ error: "Your role does not allow deleting forms" })
    );
  }

  const form = await getFormFromDynamoDB(id);

  if (!form || form.id_team !== idTeam) {
    return apiResponse(
      403,
      JSON.stringify({ error: "The form to be deleted does not exist" })
    );
  }

  await deleteForm(id);

  return apiResponse(200, JSON.stringify({ deleted: true }));
};

export const handler = middlewares(ivplementation);
