import { Handler } from "aws-lambda/handler";
import { parse } from "csv-parse/sync";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getCsvAsString } from "../../../../../shared/utils/csv/CSV";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { storeErrorsToS3 } from "../../../../../shared/utils/StoreErrors";
import { getAggregateErrors } from "../utils/Validation";

const lambda: Handler = async (event) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const body = JSON.parse(JSON.stringify(event.body) ?? "{}") as {
    csv: string;
    chain_id: number;
  };

  const tmpCsvPath = body.csv;
  const chain_id = body.chain_id;

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot create allow lists",
      })
    );
  }

  if (!tmpCsvPath) {
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

  const resultValidation = await getAggregateErrors(
    rows,
    Number(chain_id),
    team.teamId
  );
  const hasValidationErrors = resultValidation.aggregateErrors.length > 0;

  return apiResponse(
    200,
    JSON.stringify({
      counters: {
        rows: rows.length,
        errors: resultValidation.aggregateErrors.length,
      },
      errors: hasValidationErrors
        ? {
            downloadUrlTmp: await storeErrorsToS3(
              "create-allowlist",
              resultValidation.aggregateErrors
            ),
          }
        : undefined,
    })
  );
};

export const handler: any = middlewares(lambda);
