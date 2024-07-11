import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { Handler } from "aws-lambda/handler";
import { parse } from "csv-parse/sync";
import * as tmp from "tmp";
import {
  CSVRow,
  getCsvAsString,
  getLocalImagesCount,
} from "../../../../../../shared/utils/csv/CSV";
import { storeErrorsToS3 } from "../../../../../../shared/utils/StoreErrors";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { tmpFileExists } from "../../../Storage/utils/Storage";

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

  if (!tmpCsvPath || !(await tmpFileExists(tmpCsvPath))) {
    return apiResponse(400, JSON.stringify({ error: "Missing CSV file" }));
  }

  const csvAsString = await getCsvAsString(tmpCsvPath);

  if (!csvAsString) {
    return apiResponse(400, JSON.stringify({ error: "Missing CSV file" }));
  }

  const rows = parse(csvAsString, {
    delimiter: [";", ","],
    columns: true,
    skip_empty_lines: true,
  });

  const validationErrors = await getAggregateErrors(rows);
  const hasValidationErrors = validationErrors.length > 0;

  return apiResponse(
    200,
    JSON.stringify({
      counters: {
        rows: rows.length,
        errors: validationErrors.length,
        localImages: getLocalImagesCount(rows),
      },
      errors: hasValidationErrors
        ? {
            downloadUrlTmp: await storeErrorsToS3(
              "token-bulk-upload",
              validationErrors
            ),
          }
        : undefined,
    })
  );
};

export function getValidationErrorsForRow(row: CSVRow) {
  const errors: string[] = [];
  const requiredAttributes = ["name", "description", "image"];
  for (let requiredAttribute of requiredAttributes) {
    if (!row[requiredAttribute]) {
      errors.push(`Missing a required attribute: ${requiredAttribute}`);
    }
  }
  return errors;
}

export async function getAggregateErrors(rows: CSVRow[]) {
  const aggregateErrors: string[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    const rowErrors = getValidationErrorsForRow(row);
    rowErrors.forEach((rowError) => {
      aggregateErrors.push(`Row ${index + 1}: ${rowError}`);
    });
  }
  return aggregateErrors;
}

export const handler: any = middlewares(lambda);
