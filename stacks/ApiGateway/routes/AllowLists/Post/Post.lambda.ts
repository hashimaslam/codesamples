import { CSVRow, getCsvAsString } from "../../../../../shared/utils/csv/CSV";
import { isValidChainId, ERC20Token } from "../../../../../shared/utils/Web3";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { Branding } from "../../Tenants/utils/Tenants";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { createAllowList, createAllowListItem } from "../utils/AllowLists";
import {
  AllowList,
  AllowListItem,
  AllowListItemStatus,
  AllowListStatus,
} from "../utils/AllowLists.types";
import { storePublicFile, deletePublicFile } from "../../Storage/utils/Storage";
import { getAggregateErrors } from "../utils/Validation";
import { Handler } from "aws-lambda/handler";
import { parse } from "csv-parse/sync";
import { v4 as uuid } from "uuid";
import { Time } from "../../../../../shared/utils/DateTime";

const lambda: Handler = async (event) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const body = JSON.parse(JSON.stringify(event.body) ?? "{}") as {
    csv: string;
    chain_id: number;
    name: string;
    notes: string;
    branding: Branding;
  };

  const tmpCsvPath = body.csv;
  const chain_id = body.chain_id;
  const listName = body.name;
  const listNotes = body.notes;
  const branding = body.branding;

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

  if (!chain_id || !isValidChainId(Number(chain_id))) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid chain_id provided" })
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

  if (hasValidationErrors) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Invalid CSV file, please upload again to revalidate",
      })
    );
  }
  const listId = uuid();
  const allowList: AllowList = {
    id: listId,
    team_id: team.teamId,
    start_date: Time.now(),
    end_date: undefined,
    status: AllowListStatus.DRAFT,
    name: listName,
    notes: listNotes,
    chain_id: Number(chain_id),
    supply: Number(0),
    wallet_count: rows.length,
    branding: branding,
  };

  if (allowList.branding) {
    if (allowList.branding.logo) {
      const sourcePath = allowList.branding.logo;
      const [extension] = sourcePath.split(".").slice(-1);
      const targetPath = `allow_lists/${listId}/branding_logo_${uuid()}.${extension}`;
      await storePublicFile(sourcePath, targetPath);
      allowList.branding.logo = targetPath;
    }
  }

  await createAllowList(allowList);

  await Promise.all(
    rows.map(async (row: CSVRow) => {
      const allowlistItem: AllowListItem = {
        id: uuid(),
        address: row["address"],
        allow_list_id: listId,
        currency: resultValidation.erc20s.find(
          (e: ERC20Token) => e.address === row["currencyAddress"]
        ),
        max_claimable: Number(row["maxClaimable"]),
        email: row["email"],
        price: Number(row["price"]),
        status: AllowListItemStatus.NOT_CLAIMED,
        tokens_owned: 0,
      };
      await createAllowListItem(allowlistItem);
    })
  );

  return apiResponse(200, JSON.stringify({ id: listId }));
};

export const handler: any = middlewares(lambda);
