import {
  EMAIL_FROM_DEFAULT_SENDER,
  SENDGRID_CSV_EXPORT,
} from "../../../../../shared/utils/Constants";
import { storeCSVToS3 } from "../../../../../shared/utils/csv/CSV";
import { getSendGrid } from "../../../../../shared/utils/SendGrid";
import { AudienceFilters } from "../../Audiences/utils/Audiences.types";
import { getAudiencesFromOpensearch } from "../../Audiences/utils/Audiences";
import { getUser } from "../../Users/utils/Users";
import { reconcileChurnedDBtoCSV } from "../utils/Churned";

interface BackgroundJobRequest {
  userId: string;
  teamId: string;
  sortBy?: string[];
  filters: AudienceFilters;
}

export const handler = async (event: BackgroundJobRequest) => {
  const userId = event.userId;

  const user = await getUser(userId);

  const results = await getAudiencesFromOpensearch(
    event.filters,
    0,
    undefined,
    event.sortBy,
    event.teamId,
    [],
    [],
    true
  );

  if (results.data.length > 0) {
    const reconciledData = reconcileChurnedDBtoCSV(results.data);
    const csvUrl = await storeCSVToS3(reconciledData, "churned-audiences");
    const sendGrid = await getSendGrid();
    const res = await sendGrid.send({
      from: EMAIL_FROM_DEFAULT_SENDER,
      to: user.email,
      tevplateId: SENDGRID_CSV_EXPORT,
      dynamicTevplateData: {
        url: csvUrl,
      },
    });

    console.info(
      "Export CSV Churned members finished: ",
      JSON.stringify({ result: res, totalItems: results.absoluteCount })
    );
    return;
  }

  console.warn(
    "Export CSV Churned members finished without results for the specified params."
  );
  return;
};
