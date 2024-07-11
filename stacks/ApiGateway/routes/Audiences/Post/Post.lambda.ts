import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import {
  createAudience,
  createAudienceIndexesIfNeeded,
  isAddressPresentForATeam,
  validateAddress,
} from "../utils/Audiences";
import { Audience, MEMBER_TYPE } from "../utils/Audiences.types";
import { MAX_NOTE_SIZE } from "../Notes/utils/Notes.types";
import { createNote } from "../Notes/utils/Notes";
import { SOURCE_TYPE, Source } from "../../Sources/utils/Sources.types";
import {
  createSources,
  getSourceById,
  getSourceIdBySourceName,
  updateSourceSingleField,
} from "../../Sources/utils/Sources";
import { ethers } from "ethers";
import { CHAIN_IDS } from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { Time } from "../../../../../shared/utils/DateTime";
import { removeDuplicates } from "../../../../../shared/utils/Common";
import { getCheckSumAddress } from "../../../../../shared/utils/Web3";

interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };

  body: {
    address: string;
    email?: string;
    tags?: [string];
    type?: string;
    notes?: string;
    chain_id?: number;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const team = await getTeamOfUser(userId);
  const body = event.body;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot add new audience member",
      })
    );
  }

  if (!body.address) {
    return apiResponse(
      400,
      JSON.stringify({ error: "address parameter is mandatory." })
    );
  }

  // Validate the address
  const [flag] = await validateAddress(
    body.address,
    team.teamId,
    body.chain_id
  );

  if (!flag) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid address provided." })
    );
  }

  await createAudienceIndexesIfNeeded();

  const audienceList = await isAddressPresentForATeam(
    getCheckSumAddress(body.address),
    team.teamId
  );

  if (audienceList.length > 0) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Audience member already exist." })
    );
  }

  // first create a source before adding the audience
  const sourceName = "Manual Import";

  // check if the source for manual import already exists
  let sourceItemId: string | undefined = await getSourceIdBySourceName(
    team.teamId,
    sourceName
  );

  if (!sourceItemId) {
    const source: Source = {
      id: uuid(),
      team_id: team.teamId,
      address: ethers.constants.AddressZero,
      source_name: sourceName.trim(),
      type: SOURCE_TYPE.MANUAL,
      createdAt: Time.now(),
      membersCount: 1,
    };

    await createSources(source);

    sourceItemId = source.id!;
  } else {
    const source: Source | undefined = await getSourceById(sourceItemId);
    await updateSourceSingleField(
      sourceItemId,
      "membersCount",
      (source?.membersCount || 0) + 1
    );
  }

  const aData = CHAIN_IDS.map((chainId: number) => {
    return {
      chainId: chainId,
      ethBalance: 0,
      usdBalance: 0,
      nfts: 0,
      allTimeTransactions: 0,
    };
  });

  // Now create the audience manually
  const audience: Audience = {
    id: uuid(),
    team_id: team.teamId,
    address: getCheckSumAddress(body.address),
    email: body.email,
    tags: body.tags,
    type:
      body.type && MEMBER_TYPE.includes(body.type.toLowerCase().trim())
        ? body.type.toLowerCase().trim()
        : "holder",
    sources: [sourceName],
    source_ids: [sourceItemId!],
    data: aData,
    //Totals across all networks
    nfts: 0,
    usdBalance: 0,
    allTimeTransactions: 0,
    firstTransactionDate: 0,
    lastTransactionDate: 0,
    createdAt: Time.now(),
  };

  await createAudience(audience);

  // once the audience is created, create a note inside notes table if the notes is present
  if (body.notes && body.notes.length <= MAX_NOTE_SIZE) {
    await createNote({
      id: uuid(),
      team_id: team.teamId,
      note_content: body.notes,
      audience_id: audience.id,
      timestamp: Time.now(),
      updated_at: 0,
    });
  }

  return apiResponse(200, JSON.stringify({ id: audience.id }));
};

export const handler: any = middlewares(ivplementation);
