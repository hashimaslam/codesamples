import {
  BackgroundJob,
  BackgroundJobs,
} from "../../../../../shared/utils/BackgroundJobs";
import {
  fetchAudienceAddresses,
  updateSourceSingleField,
} from "../utils/Sources";

export const handler = async (event: {
  contractAddress: string;
  team_id: string;
  chain_id: number;
  source: string;
  sourceId: string;
  job_id: string;
}) => {
  let upd_job: BackgroundJob = {
    id: event.job_id,
    status: "succeeded",
    payload: {},
  };

  const { count, totalCount, errors } = await fetchAudienceAddresses(
    event.contractAddress,
    event.chain_id,
    event.source,
    event.sourceId,
    event.team_id
  );

  await updateSourceSingleField(event.sourceId, "membersCount", totalCount);

  const results = `Fetched a total of ${count} / ${totalCount} unique addresses from the contract ${event.contractAddress}`;

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
};
