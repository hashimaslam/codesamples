import {
  BackgroundJob,
  BackgroundJobs,
} from "../../../../../shared/utils/BackgroundJobs";
import { getAudiencesListByFilter } from "../../Audiences/utils/Audiences";
import { cascadeDeleteSource, deleteSource } from "../utils/Sources";
import { getErrorMessage } from "../../../../../shared/utils/Common";

export const handler = async (event: {
  jobId: string;
  sourceId: string;
  sourceName: string;
  teamId: string;
}) => {
  const job = await BackgroundJobs.getJob(event.jobId);

  let errors: Array<string> = [];

  let upd_job: BackgroundJob = {
    id: event.jobId,
    status: "succeeded",
    payload: {},
  };

  try {
    // First delete audience holdings data
    let actualCount = 0;
    let dataLength = 0;

    do {
      const { data, absoluteCount } = await getAudiencesListByFilter(
        {
          sourceId: [event.sourceId],
        },
        event.teamId
      );

      errors = errors.concat(
        (
          await cascadeDeleteSource(
            event.sourceId,
            event.sourceName,
            event.teamId,
            data
          )
        ).errors
      );

      actualCount = absoluteCount;
      dataLength = data.length;
    } while (actualCount > dataLength);

    // If the audience and audience holdings data has been deleted successfully, delete the source.
    await deleteSource(event.sourceId);

    const results = `Deleted the audience(${actualCount} members), audience holdings and source for a source id ${event.sourceId}`;

    upd_job.payload = { results };

    if (errors.length > 0) {
      upd_job.payload = {
        errors,
      };
      upd_job.status = "failed";
    }

    await BackgroundJobs.updateJob(upd_job);
  } catch (err) {
    upd_job.status = "failed";
    errors.push(`Something unexpected happened: ${getErrorMessage(err)}`);
    upd_job.payload = { errors };

    await BackgroundJobs.updateJob(upd_job);
  }
};
