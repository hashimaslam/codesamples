import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { parse } from "csv-parse/sync";
import { CSVRow, getCsvAsString } from "../../../../../shared/utils/csv/CSV";
import { isValidChainId, ERC20Token } from "../../../../../shared/utils/Web3";
import { createAllowListItem } from "../utils/AllowLists";
import { getAggregateErrors } from "../utils/Validation";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  getAllowListById,
  updateAllowList,
  deleteAllowListItemsByAllowListId,
} from "../utils/AllowLists";
import { isUUID } from "../../../../../shared/utils/Common";
import {
  AllowListStatus,
  AllowList,
  AllowListItem,
  AllowListItemStatus,
} from "../utils/AllowLists.types";
import { Branding } from "../../Tenants/utils/Tenants";
import { v4 as uuid } from "uuid";
interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
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
  body: {
    csv?: string;
    chain_id?: number;
    name?: string;
    notes?: string;
    end_date?: number;
    branding?: Branding;
    status?: AllowListStatus;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const queries = event.pathParameters;
  const allowlist_id = queries?.id;
  const body = JSON.parse(JSON.stringify(event.body) ?? "{}") as {
    csv?: string;
    chain_id?: number;
    name?: string;
    notes?: string;
    end_date?: number;
    branding?: Branding;
    status?: AllowListStatus;
  };

  const tmpCsvPath = body.csv;
  const chain_id = body.chain_id;
  const listName = body.name;
  const listNotes = body.notes;
  const status = body.status;
  const end_date = body?.end_date;
  const branding = body.branding;

  if (!allowlist_id || !isUUID(allowlist_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing allow list id" }));
  }

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin or editor. You cannot update allowlists",
      })
    );
  }

  const currentList = await getAllowListById(allowlist_id);

  if (!currentList || currentList.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This allow list does not exist or is not managed by your team",
      })
    );
  }

  if (!!chain_id && !isValidChainId(Number(chain_id))) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid chain_id provided" })
    );
  }

  if (
    currentList.status === AllowListStatus.READY &&
    currentList.collection_id !== ""
  ) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This allow list is ACTIVE, can't be modified",
      })
    );
  }
  const isEditable =
    status &&
    status !== AllowListStatus.DRAFT &&
    status !== AllowListStatus.READY;
  if (isEditable) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This status is not a valid status",
      })
    );
  }

  const updList: AllowList = {
    id: currentList.id,
    status:
      listName || listNotes || tmpCsvPath || chain_id
        ? AllowListStatus.DRAFT
        : status,
  };
  if (listName) updList.name = listName;
  if (listNotes) updList.notes = listNotes;
  if (end_date) updList.end_date = end_date;
  if (branding) updList.branding = branding;

  if (tmpCsvPath) {
    if (chain_id) updList.chain_id = chain_id;
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
      Number(updList.chain_id),
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
    } else {
      await deleteAllowListItemsByAllowListId(updList.id as unknown as string);
      // update the wallet count
      updList.wallet_count = rows.length;

      await Promise.all(
        rows.map(async (row: CSVRow) => {
          const allowlistItem: AllowListItem = {
            id: uuid(),
            address: row["address"],
            allow_list_id: currentList.id,
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
    }
  }

  const updatedList = await updateAllowList(updList);
  return apiResponse(200, JSON.stringify(updatedList));
};

export const handler: any = middlewares(ivplementation);
