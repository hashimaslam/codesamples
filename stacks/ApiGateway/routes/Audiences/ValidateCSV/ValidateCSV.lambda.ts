import { Handler } from "aws-lambda/handler";
import { tmpFileExists } from "../../Storage/utils/Storage";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { CSVRow, getCsvAsString } from "../../../../../shared/utils/csv/CSV";
import { parse } from "csv-parse/sync";
import { storeErrorsToS3 } from "../../../../../shared/utils/StoreErrors";
import { getAggregateErrors } from "../../../../../shared/utils/csv/getAggregateErrors";
import { isAddress } from "ethers/lib/utils";
import { DATA_INGESTION_AVAILABLE_CHAINS } from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";

export function isEmptyRow(row: CSVRow) {
  return !(Object.keys(row) as Array<any>).find(
    (key) => row[key].trim() !== ""
  );
}

export async function getValidationErrorsForRow(
  row: CSVRow,
  requiredAttributes: string[] = ["address"]
) {
  const errors: string[] = [];
  if (!isEmptyRow(row)) {
    for (let requiredAttribute of requiredAttributes) {
      if (!row[requiredAttribute]) {
        errors.push(`Missing a required attribute: ${requiredAttribute}`);
      }
    }
    if (errors.length > 0) {
      return errors;
    }

    if (
      requiredAttributes.includes("chainid") &&
      (isNaN(Number(row.chainid)) ||
        !DATA_INGESTION_AVAILABLE_CHAINS.includes(Number(row.chainid)))
    ) {
      errors.push(`Chainid ${row.chainid} is invalid`);
    }

    if (row.email && !row.email.includes("@")) {
      errors.push(`Email ${row.EMAIL} is invalid`);
    }

    if (!isAddress(row.address)) {
      errors.push(`Address ${row.address} is invalid`);
    }
  }
  return errors;
}

export const lambda: Handler = async (event) => {
  const idUser = event.requestContext.authorizer?.claims.sub as string;

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

  const validationErrors = await getAggregateErrors(
    rows,
    getValidationErrorsForRow
  );
  const hasValidationErrors = validationErrors.length > 0;

  return {
    statusCode: 200,
    body: {
      counters: {
        rows: rows.length,
        errors: validationErrors.length,
      },
      errors: hasValidationErrors
        ? {
            downloadUrlTmp: await storeErrorsToS3(
              "audiences-csv-import",
              validationErrors
            ),
          }
        : undefined,
    },
  };
};

export const handler: any = middlewares(lambda);
