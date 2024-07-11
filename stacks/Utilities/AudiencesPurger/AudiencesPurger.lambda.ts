import {
  BackgroundJobError,
  BackgroundJobs,
} from "../../../shared/utils/BackgroundJobs";
import { TableNames } from "../../../shared/utils/TableNames";
import { batchDeleteItems } from "../../../shared/utils/DynamoDB";
import { getErrorMessage } from "../../../shared/utils/Common";
import {
  createAudienceIndexesIfNeeded,
  getAudiencesListByTeamFromDynamoDB,
  removeAudienceIndexes,
} from "../../ApiGateway/routes/Audiences/utils/Audiences";
import {
  Audience,
  AudienceHolding,
} from "../../ApiGateway/routes/Audiences/utils/Audiences.types";
import {
  getSegmentMembers,
  getSegmentsByTeamId,
} from "../../ApiGateway/routes/Segments/utils/Segments";
import {
  Segment,
  SegmentMember,
} from "../../ApiGateway/routes/Segments/utils/Segments.types";
import { Source } from "../../ApiGateway/routes/Sources/utils/Sources.types";
import { getAllSources } from "../../ApiGateway/routes/Sources/utils/Sources";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";

export const handler = async () => {
  try {
    const audiences: Audience[] = await getAudiencesListByTeamFromDynamoDB();
    const audiences_ids = audiences.map((h) => {
      return h.id;
    });
    const aTableName = await TableNames.audiences();
    await batchDeleteItems(aTableName, audiences_ids);
    getLogger().info(
      `Purged ${audiences_ids.length} items from table ${aTableName}`
    );

    const segmentMembers: SegmentMember[] = await getSegmentMembers();
    const segmembers_ids = segmentMembers.map((h) => h.id);
    const smTableName = await TableNames.segmentMembers();
    await batchDeleteItems(smTableName, segmembers_ids);
    getLogger().info(
      `Purged ${segmembers_ids.length} items from table ${smTableName}`
    );

    const segments: Segment[] = await getSegmentsByTeamId();
    const segments_ids = segments.map((h) => h.id);
    const sTableName = await TableNames.segments();
    await batchDeleteItems(sTableName, segments_ids);
    getLogger().info(
      `Purged ${segments_ids.length} items from table ${sTableName}`
    );

    const jobErrors: BackgroundJobError[] = await BackgroundJobs.getErrors();
    const joberror_ids = jobErrors.map((h) => h.id);
    const bgTableName = await TableNames.backgroundJobErrors();
    const bjErrors = await batchDeleteItems(bgTableName, joberror_ids);
    if (bjErrors.error) {
      getLogger().error(
        `Errors from table ${bgTableName} purge: ${JSON.stringify(bjErrors)}`
      );
    }
    getLogger().info(
      `Purged ${joberror_ids.length} items from table ${bgTableName}`
    );

    const sources: Source[] = await getAllSources();
    const source_ids = sources.map((h) => {
      return h.id;
    });
    const soTableName = await TableNames.sources();
    await batchDeleteItems(soTableName, Array.from(source_ids.values()));
    getLogger().info(
      `Purged ${source_ids.length} items from table ${soTableName}`
    );

    await removeAudienceIndexes();
    await createAudienceIndexesIfNeeded();
    getLogger().info(`Recreated all Audience indexes from OpenSearch`);
  } catch (e) {
    const errorMessage = getErrorMessage(e);
    console.error(errorMessage);
    getLogger().error("Error Purging Audiences tables:", errorMessage);
  }
};
