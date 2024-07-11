import { v4 as uuid } from "uuid";
import { TokenAttribute } from "../../utils/Tokens.types";
import {
  getBucketNameForTokenThumbnails,
  getTmpStorageBucketName,
  uploadFile,
} from "../../../Storage/utils/Storage";
import { getTeamOfUser } from "../../../Users/utils/Users";
import { createToken } from "../../utils/Tokens";
import { Collection } from "../../../Collections/utils/Collections.types";
import { getCollectionById } from "../../../Collections/utils/Collections";
import { parse } from "csv-parse/sync";
import { getValidationErrorsForRow } from "../ValidateCSV/ValidateCSV.lambda";
import * as tmp from "tmp";
import { unzipS3ArchiveToLocalDir } from "../../../Storage/utils/unzipS3ArchiveToLocalDir";
import * as fs from "fs";
import * as path from "path";
import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../../shared/utils/TableNames";
import { CSVRow, getCsvAsString } from "../../../../../../shared/utils/csv/CSV";

export const handler = async (event: {
  id: string;
  csv: string;
  zip?: string;
  idCollection: string;
  idUser: string;
}) => {
  const tmpCsvPath = event.csv;
  const tmpZipPath = event.zip;
  const idJob = event.id;
  try {
    const rows = await getParsedCSV(tmpCsvPath);

    const userId = event.idUser;
    const team = await getTeamOfUser(userId);

    const collectionId = event.idCollection;
    const collection: Collection | undefined = await getCollectionById(
      collectionId
    );

    const zip = await getUnzippedFilesProcessor(tmpZipPath);

    // Start iterating the CSV rows and aggregate results to an array, to be returned from the API
    const results: Array<ResultRow> = [];

    const startTimestampForBulk = Date.now();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const startTimeStampForRow = Date.now();

      try {
        // See if any of the required attributes for a token is missing
        const validationErrorsForRow = getValidationErrorsForRow(row);

        if (validationErrorsForRow.length > 0) {
          // Skip importing this CSV row if there are validation errors
          results.push({
            success: false,
            errors: validationErrorsForRow,
          });
          continue;
        }

        const { id } = await createToken({
          id: uuid(),
          collection_id: collectionId,
          collection_name: collection?.name,
          chain_id: collection?.chain_id as unknown as number,
          team_id: team.teamId,
          name: getRowAttribute(row, "name"),
          description: getRowAttribute(row, "description"),
          youtube_url: getRowAttribute(row, "youtube_url"),
          external_url: getRowAttribute(row, "external_url"),
          animation_url: getRowAttribute(row, "animation_url"),
          image: zip
            ? await extractImageFromRow(row, zip)
            : getRowAttribute(row, "image"),
          attributes: getCustomTokenAttributes(row),
          mktplace_options: undefined,
          mktplace_front: false,
          mktplace_option: "",
          minted_date: 0,
        });

        results.push({
          success: true,
          tokenId: id,
        });
      } catch (e) {
        console.error("Internal error when creating the token", e);
        results.push({
          success: false,
          errors: [(e as any).message],
        });
      }

      console.log(`Row ${i} took ${Date.now() - startTimeStampForRow}ms`);
      console.log(`Total time so far: ${Date.now() - startTimestampForBulk}ms`);
    }

    await updateBackgroundJobStatus(idJob, "succeeded", results);
  } catch (e) {
    console.error(e);
    await updateBackgroundJobStatus(idJob, "failed");
  }
};

async function getUnzippedFilesProcessor(tmpZipPath: string | undefined) {
  if (!tmpZipPath) {
    console.log(`No path to ZIP file provided. Nothing to process`);
    return;
  }
  const zip = new ZipFilesProcessor(tmpZipPath);
  await zip.unzip();
  return zip;
}

function getRowAttribute(row: CSVRow, name: string) {
  return row[name] ?? "";
}

async function uploadTokenImage(localPath: string) {
  const fileName = path.basename(localPath);
  const targetPath = `tokens_images/${uuid()}/${fileName}`;
  await uploadFile({
    Bucket: await getBucketNameForTokenThumbnails(),
    Key: targetPath,
    Body: fs.readFileSync(localPath),
  });
  return targetPath;
}

type ResultRowSuccess = {
  success: true;
  tokenId: string;
};

type ResultRowError = {
  success: false;
  errors: string[];
};

type ResultRow = ResultRowError | ResultRowSuccess;

class ZipFilesProcessor {
  localPath: string;
  private files: string[];

  constructor(private tmpZipPathInS3: string) {}

  async unzip() {
    // Download and unzip the zip file to a temporary local directory in the Lambda /tmp folder
    const tmpDir = tmp.dirSync({ prefix: "unzipper-" });
    const localPath = tmpDir.name;

    await unzipS3ArchiveToLocalDir({
      sourceBucket: await getTmpStorageBucketName(),
      sourceKey: this.tmpZipPathInS3,
      localPath,
    });

    const imageFilesDir = fs.readdirSync(localPath);
    this.files = fs.readdirSync(localPath + "/" + imageFilesDir[0]);

    this.localPath = localPath + "/" + imageFilesDir[0];
  }

  includesFile(fileName: string) {
    return this.files.includes(fileName);
  }
}

async function extractImageFromRow(row: CSVRow, zip: ZipFilesProcessor) {
  const rowImage = row.image;

  if (!rowImage) {
    return;
  }

  console.log(zip);

  if (zip.includesFile(rowImage)) {
    // CSV row is referring to a local image inside the Zip file
    // Upload it to S3 and return the S3 path
    const path = await uploadTokenImage(`${zip.localPath}/${rowImage}`);
    return path;
  } else {
    // Most likely an external image like IPFS hash or an HTTPS URL. Leave it intact
    return rowImage;
  }
}

async function updateBackgroundJobStatus(
  idJob: string,
  status: "succeeded" | "failed",
  payload: any = {}
) {
  await new DynamoDB()
    .updateItem({
      TableName: await TableNames.backgroundJobs(),
      Key: DynamoDB.Converter.marshall({
        id: idJob,
      }),
      UpdateExpression: "SET #status = :status, #payload = :payload",
      ExpressionAttributeNames: {
        "#status": "status",
        "#payload": "payload",
      },
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":status": status,
        ":payload": payload,
      }),
    })
    .promise();
}

function getCustomTokenAttributes(row: CSVRow): TokenAttribute[] {
  const attributeNames = Object.keys(row);
  const standardAttributes = [
    "name",
    "description",
    "youtube_url",
    "external_url",
    "animation_url",
    "image",
  ];
  return (
    attributeNames
      // Remove EIP721 standard attributes from the array
      .filter((key) => !standardAttributes.includes(key))
      .map((key) => {
        const value = row[key];
        return {
          name: key,
          value,
        };
      })
  );
}

async function getParsedCSV(csvTmpPath: string) {
  const csvAsString = await getCsvAsString(csvTmpPath);

  if (!csvAsString) {
    throw new Error(`Could not get CSV as string`);
  }

  const rows: CSVRow[] = parse(csvAsString, {
    delimiter: [";", ","],
    columns: true,
    skip_empty_lines: true,
  });

  return rows;
}
