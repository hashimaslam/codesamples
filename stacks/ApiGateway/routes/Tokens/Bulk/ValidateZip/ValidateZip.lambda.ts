import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { Handler } from "aws-lambda/handler";
import {
  getTmpStorageBucketName,
  tmpFileExists,
} from "../../../Storage/utils/Storage";
import { parse } from "csv-parse/sync";
import * as tmp from "tmp";
import { unzipS3ArchiveToLocalDir } from "../../../Storage/utils/unzipS3ArchiveToLocalDir";
import * as fs from "fs";
import { isImage } from "./util/isImage";
import { getFileSizeInBytes } from "./util/getFileSizeInBytes";
import {
  CSVRow,
  getCsvAsString,
  isImageExternal,
} from "../../../../../../shared/utils/csv/CSV";
import { storeErrorsToS3 } from "../../../../../../shared/utils/StoreErrors";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";

tmp.setGracefulCleanup();

const lambda: Handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot upload tokens",
      })
    );
  }

  const tmpCsvPath = event.body.csv;
  const tmpZipPath = event.body.zip;

  if (!tmpCsvPath || !(await tmpFileExists(tmpCsvPath))) {
    return apiResponse(400, JSON.stringify({ error: "Missing CSV file" }));
  }

  if (!tmpZipPath || !(await tmpFileExists(tmpZipPath))) {
    return apiResponse(400, JSON.stringify({ error: "Missing ZIP file" }));
  }

  const csvAsString = await getCsvAsString(tmpCsvPath);

  if (!csvAsString) {
    return apiResponse(400, JSON.stringify({ error: "Missing CSV file" }));
  }

  // Download and unzip the zip file to a temporary local directory in the Lambda /tmp folder
  const tmpDir = tmp.dirSync({ prefix: "unzipper-" });
  const localPath = tmpDir.name;

  await unzipS3ArchiveToLocalDir({
    sourceBucket: await getTmpStorageBucketName(),
    sourceKey: tmpZipPath,
    localPath: localPath,
  });

  // Parse the CSV file and extract its rows as objects
  const csvRows: CSVRow[] = parse(csvAsString, {
    delimiter: [";", ","],
    columns: true,
    skip_empty_lines: true,
  });

  // Cross-reference the CSV rows to the zip file of images
  // See if the CSV has broken links to images or image files don't covply with our rules
  const errors = await getValidationErrors({
    csvRows,
    pathToDirOfImages: localPath,
  });

  return apiResponse(
    200,
    JSON.stringify({
      errors:
        errors.length > 0
          ? {
              downloadUrlTmp: await storeErrorsToS3(
                "token-bulk-upload-files",
                errors
              ),
            }
          : undefined,
    })
  );
};

async function getValidationErrors(props: {
  csvRows: CSVRow[];
  pathToDirOfImages: string;
}) {
  const errors: string[] = [];

  try {
    // Since the pathToDirOfImages is still a dir which contains the dir of extracted files. We are second guessing that the folder contains only the extracted dir.
    const imageFilesDir = fs.readdirSync(props.pathToDirOfImages);
    const imageFilenamesFromZip = fs.readdirSync(
      props.pathToDirOfImages + "/" + imageFilesDir[0]
    );

    const imageFileDirName = `${props.pathToDirOfImages}/${imageFilesDir[0]}`;

    for (let index = 0; index < props.csvRows.length; index++) {
      const row = props.csvRows[index];
      const image = row.image;
      const localFilePath = `${imageFileDirName}/${image}`;

      // Skip validation for CSV rows that don't refer to local images
      if (!image || isImageExternal(image)) {
        continue;
      }

      // Check if the CSV row refers to an image file that exists inside the zip archive
      const existsInsideZip = imageFilenamesFromZip.includes(image);
      if (!existsInsideZip) {
        errors.push(`Row ${index}: Image ${image} not found in zip`);
        continue;
      }

      // Check if the image file is too large
      const fileSizeInBytes = getFileSizeInBytes(localFilePath);
      if (fileSizeInBytes / 1024 / 1024 > 10) {
        errors.push(`Row ${index}: Image ${image} is too large (max 10MB)`);
      }

      // Detect image type based on file headers and metadata
      if (!(await isImage(localFilePath))) {
        errors.push(`Row ${index}: File ${image} is not an image`);
      }
    }
  } catch (error) {
    errors.push(
      "Your zip file should to be a compressed folder, not just independent files"
    );
  }
  return errors;
}

export const handler: any = middlewares(lambda);
