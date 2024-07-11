import {
  getSegmentsByTeamId,
  updateSegment,
} from "../../ApiGateway/routes/Segments/utils/Segments";
import {
  SEGMENT_TYPE,
  Segment,
} from "../../ApiGateway/routes/Segments/utils/Segments.types";
import { getFullAudiencesListFromOpensearch } from "../../ApiGateway/routes/Audiences/utils/Audiences";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";

export const handler = async () => {
  const segments: Segment[] = await getSegmentsByTeamId();
  for (const segment of segments) {
    if (segment.type === SEGMENT_TYPE.DYNAMIC) {
      let { absoluteCount } = await getFullAudiencesListFromOpensearch(
        {
          sourceId: segment?.filters?.sourceId,
          type: segment?.filters?.type,
          tags: segment?.filters?.tags,
          searchText: segment?.filters?.searchText?.toLowerCase(),
        },
        segment.filters?.sort!,
        segment.team_id,
        ["id"]
      );
      if (
        segment.filters?.totalCount !== segment.totalMembers ||
        segment.filters?.totalCount !== absoluteCount
      ) {
        segment.filters!.totalCount = segment.totalMembers = absoluteCount;
        getLogger().info(
          `Segment ${segment.id} was updated to ${absoluteCount} members`
        );
        await updateSegment(segment);
      }
    }
  }
};
