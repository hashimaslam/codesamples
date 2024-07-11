import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { FORM_STATUS, Form } from "../utils/Forms.types";
import { getFormFromDynamoDB, updateFormSingleField } from "../utils/Forms";

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
      JSON.stringify(
        "Sorry you are not an admin/editor. You cannot unpublish a form."
      )
    );
  }

  const formData: Form | undefined = await getFormFromDynamoDB(form_id);

  if (!formData || formData.id_team !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid Form Id provided." })
    );
  }

  // update form status to unpublished
  await updateFormSingleField(form_id, "status", FORM_STATUS.UNPUBLISHED);

  return apiResponse(
    200,
    JSON.stringify({
      id: form_id,
      message: "Unpublished successfully!",
    })
  );
};

export const handler = middlewares(ivplementation);
