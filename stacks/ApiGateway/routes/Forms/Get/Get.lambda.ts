import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { getFormFromDynamoDB } from "../utils/Forms";
import { getPublicFixedURL } from "../../Storage/utils/Storage";

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

  const team = await getTeamOfUser(userId);
  const form_id = event.pathParameters.id;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry you are not an admin/editor. You cannot view a form.",
      })
    );
  }

  const formData = await getFormFromDynamoDB(form_id);

  if (!formData || formData.id_team !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid Form Id provided." })
    );
  }

  if (formData.logo_path) {
    formData.logo_path = await getPublicFixedURL(formData.logo_path);
  }

  return apiResponse(200, JSON.stringify(formData));
};

export const handler = middlewares(ivplementation);
