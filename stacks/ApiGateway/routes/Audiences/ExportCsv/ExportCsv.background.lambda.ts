import {
  EMAIL_FROM_DEFAULT_SENDER,
  SENDGRID_CSV_EXPORT,
} from "../../../../../shared/utils/Constants";
import { storeCSVToS3 } from "../../../../../shared/utils/csv/CSV";
import { getSendGrid } from "../../../../../shared/utils/SendGrid";
import { fetchData, getSegmentById } from "../../Segments/utils/Segments";
import { getSourceById } from "../../Sources/utils/Sources";
import { getUser } from "../../Users/utils/Users";
import {
  getAudiencesFromOpensearch,
  reconcileAudiencesDBtoCSV,
} from "../utils/Audiences";
import { OS_MAX_PAGINATION_LIMIT } from "../utils/Audiences.types";

export const handler = async (event: {
  userId: string;
  sourceId?: string[];
  sortBy?: string[];
  type?: string[];
  tags?: string[];
  searchText?: string;
  teamId: string;
  totalItems?: number;
  segmentId?: string;
}) => {
  const userId = event.userId;

  const user = await getUser(userId);
  let segData;

  if (event.segmentId) {
    segData = await getSegmentById(event.segmentId);
  }

  // Before we cumulate and sort, lets filter
  let { data, absoluteCount } = segData
    ? await fetchData(
        segData,
        {
          type: event.type,
          sort: event.sortBy,
          tags: event.tags,
          searchText: event.searchText?.toLowerCase(),
          sourceId: event.sourceId,
          totalCount: event.totalItems,
        },
        undefined,
        undefined
      )
    : await getAudiencesFromOpensearch(
        {
          sourceId: event.sourceId,
          type: event.type,
          tags: event.tags,
          searchText: event.searchText,
        },
        0,
        event.totalItems ?? OS_MAX_PAGINATION_LIMIT + 1, //To get ALL the records
        event.sortBy,
        event.teamId
      );

  if (data.length > 0) {
    const reconciledData = reconcileAudiencesDBtoCSV(data);
    let csvUrl = "";
    if (segData) {
      csvUrl = await storeCSVToS3(reconciledData, segData.name);
    } else if (event.sourceId && event.sourceId.length > 0) {
      // If we have more than one source id as a filter, pick the first source id for the source name
      const source = await getSourceById(event.sourceId[0]);
      csvUrl = await storeCSVToS3(reconciledData, source?.source_name);
    } else {
      csvUrl = await storeCSVToS3(reconciledData, "member-listing");
    }
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
      "Export CSV Audiences finished: ",
      JSON.stringify({ result: res, totalItems: absoluteCount })
    );
    return;
  }

  console.warn(
    "Export CSV Audiences finished without results for the specified params."
  );
  return;
};
