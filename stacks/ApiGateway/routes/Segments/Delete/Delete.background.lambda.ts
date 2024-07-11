import {
  BackgroundJob,
  BackgroundJobs,
} from "../../../../../shared/utils/BackgroundJobs";
import {
  deleteSegment,
  deleteSegmentMembers,
} from "../../Segments/utils/Segments";
import { getErrorMessage } from "../../../../../shared/utils/Common";

export const handler = async (event: { jobId: string; segmentId: string }) => {
  const job = await BackgroundJobs.getJob(event.jobId);

  let errors: Array<string> = [];

  let upd_job: BackgroundJob = {
    id: event.jobId,
    status: "succeeded",
    payload: {},
  };

  try {
    if (await deleteSegmentMembers(event.segmentId)) {
      await deleteSegment(event.segmentId);
      const results = `Deleted segment ${event.segmentId}`;
      upd_job.payload = { results };
    } else {
      errors.push(`Failed to delete segment members`);
    }
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
