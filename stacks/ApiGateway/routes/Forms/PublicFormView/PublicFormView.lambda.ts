import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getFormFromDynamoDB } from "../utils/Forms";
import { FORM_STATUS } from "../utils/Forms.types";
import { getPublicFixedURL } from "../../Storage/utils/Storage";

interface Request extends Omit<APIGatewayProxyEvent, "pathParameters"> {
  pathParameters: {
    id: string;
  };
}

const ivplementation = async (event: Request) => {
  const form_id = event.pathParameters.id;

  const formData = await getFormFromDynamoDB(form_id);

  if (!formData) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid Form Id provided" })
    );
  }

  if (formData.status !== FORM_STATUS.PUBLISHED) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Form is not published." })
    );
  }

  if (formData.logo_path) {
    formData.logo_path = await getPublicFixedURL(formData.logo_path);
  }

  return apiResponse(200, JSON.stringify({ data: formData }));
};

export const handler = middlewares(ivplementation);
