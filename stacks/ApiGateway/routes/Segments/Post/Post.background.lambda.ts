import { v4 as uuid } from "uuid";
import {
  BackgroundJob,
  BackgroundJobs,
} from "../../../../../shared/utils/BackgroundJobs";
import {
  SEGMENT_CREATION_SOURCE,
  SEGMENT_ORIGIN,
  SEGMENT_STATUS,
  SEGMENT_TYPE,
  Segment,
  SegmentMember,
} from "../utils/Segments.types";
import { getFullAudiencesListFromOpensearch } from "../../Audiences/utils/Audiences";
import { createSegment } from "../utils/Segments";
import { putBatchItems } from "../../../../../shared/utils/DynamoDB";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { getErrorMessage } from "../../../../../shared/utils/Common";
import { Time } from "../../../../../shared/utils/DateTime";
import { AudienceFilters } from "../../Audiences/utils/Audiences.types";

export const handler = async (event: {
  name: string;
  team_id: string;
  filters: AudienceFilters;
  type: SEGMENT_TYPE;
  origin: SEGMENT_ORIGIN;
  creationSource: SEGMENT_CREATION_SOURCE;
  job_id: string;
}) => {
  const errors: string[] = [];

  let upd_job: BackgroundJob = {
    id: event.job_id,
    status: "succeeded",
    payload: {},
  };

  try {
    const segmentId = uuid();

    const segment: Segment = {
      id: segmentId,
      name: event.name,
      team_id: event.team_id,
      filters: event.filters,
      type: event.type,
      origin: event.origin,
      creation_source: event.creationSource,
      date_created: Time.now(),
      status: SEGMENT_STATUS.COvplETED,
      totalMembers: 0,
    };

    let segmentMembers: SegmentMember[] = [];
    let memberIds: string[] = [];
    let { data, absoluteCount } = await getFullAudiencesListFromOpensearch(
      event.filters,
      event.filters.sort!,
      event.team_id,
      ["id"]
    );

    data.forEach((row) => {
      memberIds.push(row.id!);
      if (event.type === SEGMENT_TYPE.SNAPSHOT) {
        segmentMembers.push({
          id: uuid(),
          segment_id: segmentId,
          audience_id: row.id!,
        });
      }
    });

    segment.filters!.totalCount = segment.totalMembers = absoluteCount;
    await createSegment(segment);

    if (event.type === SEGMENT_TYPE.SNAPSHOT) {
      await putBatchItems(await TableNames.segmentMembers(), segmentMembers);
    }

    const results = `Fetched a total of ${absoluteCount} members for the segment ${segment.id}`;

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
