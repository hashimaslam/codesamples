import {
  BackgroundJob,
  BackgroundJobs,
} from "../../../../../shared/utils/BackgroundJobs";
import {
  addAudienceTags,
  getFullAudiencesListFromOpensearch,
} from "../utils/Audiences";
import { getErrorMessage } from "../../../../../shared/utils/Common";
import { AudienceFilters } from "../utils/Audiences.types";

export const handler = async (event: {
  team_id: string;
  filters: AudienceFilters;
  tags: string[];
  job_id: string;
}) => {
  const errors: string[] = [];

  let upd_job: BackgroundJob = {
    id: event.job_id,
    status: "succeeded",
    payload: {},
  };

  try {
    let { data, absoluteCount } = await getFullAudiencesListFromOpensearch(
      event.filters,
      event.filters.sort!,
      event.team_id,
      ["id", "tags"]
    );

    await addAudienceTags(data, event.tags);
    const results = `Updated a total of ${absoluteCount} members with tags ${event.tags.join()}`;

    upd_job.payload = {
      results,
    };

    if (errors.length > 0) {
      upd_job.payload = {
        results: upd_job.payload?.results,
        errors,
      };
      upd_job.status = "failed";
    }

    await BackgroundJobs.updateJob(upd_job);
  } catch (err) {
    errors.push(`Something unexpected happened: ${getErrorMessage(err)}`);
    upd_job.status = "failed";
    upd_job.payload = {
      results: upd_job.payload?.results,
      errors,
    };
    await BackgroundJobs.updateJob(upd_job);
  }
};
