import { tmpFileExists } from "../../Storage/utils/Storage";
import {
  getCsvAsString,
  getRowAttribute,
} from "../../../../../shared/utils/csv/CSV";
import { parse } from "csv-parse/sync";

import {
  BackgroundJob,
  BackgroundJobs,
} from "../../../../../shared/utils/BackgroundJobs";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { v4 as uuid } from "uuid";
import { getTeamOfUser } from "../../Users/utils/Users";
import {
  getValidationErrorsForRow,
  isEmptyRow,
} from "../ValidateCSV/ValidateCSV.lambda";
import { putBatchItems } from "../../../../../shared/utils/DynamoDB";
import {
  createAudienceIndexesIfNeeded,
  isAddressPresentForATeam,
} from "../utils/Audiences";
import { Audience, MEMBER_TYPE } from "../utils/Audiences.types";
import {
  getSourceById,
  updateSourceSingleField,
} from "../../Sources/utils/Sources";
import { CHAIN_IDS } from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import {
  getErrorMessage,
  removeDuplicates,
} from "../../../../../shared/utils/Common";
import { Time, formatShortDate } from "../../../../../shared/utils/DateTime";
import { getCheckSumAddress } from "../../../../../shared/utils/Web3";
import { Note } from "../Notes/utils/Notes.types";

export const handler = async (event: {
  csv: string;
  idUser: string;
  idJob: string;
  idSource: string;
}) => {
  const job = await BackgroundJobs.getJob(event.idJob);
  let errors: Array<string> = [];

  try {
    const idUser = event.idUser;
    const team = await getTeamOfUser(idUser);
    const csv = event.csv;

    //first lets try to parse the csv and then purge the audience table based on csv parse result.

    if (!csv || !(await tmpFileExists(csv))) {
      throw new Error("Missing CSV file");
    }

    const csvAsString = await getCsvAsString(csv);

    if (!csvAsString) {
      throw new Error("Error parsing as String the CSV file");
    }

    await createAudienceIndexesIfNeeded();

    const rows = parse(csvAsString, {
      delimiter: [";", ","],
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Start iterating the CSV rows and aggregate results to an array, to be stored with the job
    const startTimestampForBulk = Date.now();

    const items: Audience[] = [];
    const noteItems: Note[] = [];

    // create source now and then add the source id/name to the audience table
    const sourceFromDb = await getSourceById(event.idSource);

    let emptyLines = 0;
    for (const row of rows) {
      if (isEmptyRow(row)) {
        emptyLines++;
        continue;
      }
      const rowErrors = await getValidationErrorsForRow(row, ["address"]);
      const hasErrors = rowErrors.length > 0;

      if (!sourceFromDb) {
        errors.push(`Source with ID ${event.idSource} not found`);
        continue;
      }

      if (hasErrors) {
        errors = errors.concat(rowErrors);
        if (errors.length > 10) {
          errors = errors.concat(
            `Showing only first 10 out of ${errors.length} errors`
          );
          break;
        }
        continue;
      }

      const address = getCheckSumAddress(
        getRowAttribute(row, "address").trim()
      );
      const email = getRowAttribute(row, "email");
      const type = getRowAttribute(row, "type").toLowerCase();
      const tags = getRowAttribute(row, "tags").toLowerCase();

      const audType = MEMBER_TYPE.includes(type.trim())
        ? type.trim()
        : "holder";
      const aData = CHAIN_IDS.map((chainId: number) => {
        return {
          chainId: chainId,
          usdBalance: 0,
          nfts: 0,
          allTimeTransactions: 0,
        };
      });

      // Check if the audience is already existing
      const audData: Audience[] = await isAddressPresentForATeam(
        address,
        team.teamId
      );
      let sourceNames = [sourceFromDb.source_name!];
      let sourceIds = [sourceFromDb.id!];

      if (audData.length > 0) {
        audData.map((ele) => {
          sourceNames = sourceNames.concat(ele.sources!);
        });

        audData.map((ele) => {
          sourceIds = sourceIds.concat(ele.source_ids!);
        });
      }

      const item: Audience = {
        id: audData.length > 0 ? audData[0].id : uuid(),
        address: address,
        email: email.trim(),
        type: audType,
        team_id: team.teamId,
        sources: sourceNames,
        source_ids: sourceIds,
        data: audData.length > 0 ? audData[0].data : aData,
        tags: audData.length > 0 ? audData[0].tags : [],
        churned_at: audData.length > 0 ? audData[0].churned_at : undefined,
        churned_duration:
          audData.length > 0 ? audData[0].churned_duration : undefined,
        //Totals across all networks
        nfts: audData.length > 0 ? audData[0].nfts : 0,
        usdBalance: audData.length > 0 ? audData[0].usdBalance : 0,
        allTimeTransactions:
          audData.length > 0 ? audData[0].allTimeTransactions : 0,
        firstTransactionDate:
          audData.length > 0 ? audData[0].firstTransactionDate : 0,
        lastTransactionDate:
          audData.length > 0 ? audData[0].lastTransactionDate : 0,
        createdAt: Time.now(),
      };

      if (tags.trim() !== "") {
        tags.split(",").forEach((t) => item.tags?.push(t));
      }
      if (item.tags) {
        item.tags = removeDuplicates(item.tags);
      }
      items.push(item);

      // Now lets add the note
      if (audData.length == 0) {
        const note: Note = {
          id: uuid(),
          team_id: team.teamId,
          note_content: `Added via CSV import on ${formatShortDate(
            new Date()
          )}`,
          audience_id: item.id,
          timestamp: Time.now(),
          updated_at: 0,
        };

        noteItems.push(note);
      }
    }

    await updateSourceSingleField(event.idSource, "membersCount", items.length);

    const res = await putBatchItems(await TableNames.audiences(), items);
    res.concat(await putBatchItems(await TableNames.notes(), noteItems));

    let invalidResults = res.filter((result: any) => result instanceof Error);
    for (const error of invalidResults) {
      errors.push(getErrorMessage(error));
    }

    const results = `Stored audiences with ${
      rows.length - errors.length - emptyLines
    } out of ${rows.length} addresses. Time since bulk operation start: ${
      Date.now() - startTimestampForBulk
    }ms`;

    const upd_job: BackgroundJob = {
      id: job?.id,
      status: "succeeded",
      payload: { results },
    };
    if (invalidResults.length > 0) {
      errors = errors.concat(invalidResults);
    }
    if (errors.length > 0) {
      upd_job.payload = {
        results: upd_job.payload?.results,
        errors: errors,
      };
    }
    await BackgroundJobs.updateJob(upd_job);
  } catch (e) {
    const errorMessage = getErrorMessage(e);
    console.error(errorMessage);
    errors.push(errorMessage);
    const upd_job: BackgroundJob = {
      id: job?.id,
      status: "failed",
      payload: { errors: errors },
    };
    await BackgroundJobs.updateJob(upd_job);
  }
};
