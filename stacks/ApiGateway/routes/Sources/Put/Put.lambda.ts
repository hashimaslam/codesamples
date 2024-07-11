import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { isUUID } from "../../../../../shared/utils/Common";
import {
  getSourceById,
  isUniqueSourceName,
  partiallyUpdateAudienceWithSourceIds,
  updateSourceSingleField,
} from "../utils/Sources";
import { getAudiencesListByFilter } from "../../Audiences/utils/Audiences";

interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };

  pathParameters: {
    id: string;
  };

  body: {
    source_name: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const sourceId = event.pathParameters.id as string;

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot update segments",
      })
    );
  }

  if (!sourceId || !isUUID(sourceId)) {
    return apiResponse(
      400,
      JSON.stringify({ error: `Missing segment id ${sourceId}` })
    );
  }

  const source = await getSourceById(sourceId);

  if (!source) {
    return apiResponse(
      400,
      JSON.stringify({ error: `Source with id ${sourceId} not found.` })
    );
  }

  if (source.team_id?.localeCompare(team.teamId) !== 0) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Cannot update other team segments." })
    );
  }

  const source_name = event.body.source_name;

  if (source_name && source_name.length > 0) {
    if (!(await isUniqueSourceName(team.teamId, source_name))) {
      return apiResponse(
        400,
        JSON.stringify({
          error: `Duplicate name. Source name with \"${source_name}\" is already present`,
        })
      );
    }

    // fetch the old source name
    const oldSourceName = source.source_name;

    await updateSourceSingleField(sourceId, "source_name", source_name);

    const { data } = await getAudiencesListByFilter(
      {
        sourceId: [sourceId],
      },
      team.teamId
    );

    if (data) {
      await partiallyUpdateAudienceWithSourceIds(
        data,
        sourceId,
        source_name,
        oldSourceName
      );
    }

    return apiResponse(200, JSON.stringify({ success: true }));
  }

  return apiResponse(
    400,
    JSON.stringify({
      error:
        "Source name not present in the payload. Only Source Name can be updated.",
    })
  );
};

export const handler: any = middlewares(ivplementation);
