import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getPresigned } from "../utils/Storage";

interface Request extends APIGatewayProxyEvent {}

const getPresignedUrl = async (event: Request) => {
  const filename = event.queryStringParameters?.filename;
  const fileType = event.queryStringParameters?.filetype;

  if (!filename) {
    return apiResponse(
      400,
      JSON.stringify({
        error: {
          code: "INVALID_FILENAME",
          message:
            "The 'filename' parameter was not provided as a query parameter",
        },
      })
    );
  }

  if (!fileType) {
    return apiResponse(
      400,
      JSON.stringify({
        error: {
          code: "INVALID_FILETYPE",
          message:
            "The 'filetype' parameter was not provided as a query parameter",
        },
      })
    );
  }

  let filetypewild = fileType;
  if (fileType !== "text/csv" && fileType !== "application/x-zip-compressed") {
    filetypewild = fileType.startsWith("video") ? "video/*" : "image/*";
  }

  const presigned = await getPresigned({
    filename,
    filetypewild,
  });

  return apiResponse(
    200,
    JSON.stringify({
      success: true,
      presigned_url: {
        upload_url: presigned.uploadUrl,
        download_url: presigned.downloadUrl,
        path: presigned.path,
      },
    })
  );
};

export const handler: any = middlewares(getPresignedUrl);
