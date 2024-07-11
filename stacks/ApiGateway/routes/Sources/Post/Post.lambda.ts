import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  createSources,
  getSourceByAddress,
  isUniqueSourceName,
} from "../utils/Sources";
import { v4 as uuid } from "uuid";
import { SOURCE_TYPE, Source } from "../utils/Sources.types";
import { getERC721 } from "../../../../../shared/utils/Web3";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import { Lambda } from "aws-sdk";
import { Time } from "../../../../../shared/utils/DateTime";

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
    chain_id: number;
    source_name: string;
    address: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const payload = event.body;

  const team = await getTeamOfUser(userId);

  if (team.role != UserRole.ADMIN && team.role != UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot add contract addresses",
      })
    );
  }

  // Before hitting the blockchain, let's check if this address already exists.
  const sourceList = await getSourceByAddress(payload.address.toLowerCase());

  const sourceItem = sourceList.filter((ele) => {
    return (
      ele.team_id?.localeCompare(team.teamId) == 0 &&
      ele.chain_id === payload.chain_id
    );
  });

  if (sourceItem.length == 0) {
    // first validate address
    const erc721Details = await getERC721(
      payload.address,
      payload.chain_id,
      team.teamId
    );

    // if invalid erc721 address, throw error
    if (erc721Details.error) {
      return apiResponse(200, JSON.stringify(erc721Details));
    }

    if (!payload.source_name) {
      return apiResponse(
        400,
        JSON.stringify({ error: "Source name not present." })
      );
    }

    if (payload.source_name) {
      if (!(await isUniqueSourceName(team.teamId, payload.source_name))) {
        return apiResponse(
          400,
          JSON.stringify({
            error: `Duplicate name. Source name with "${payload.source_name}" is already present`,
          })
        );
      }
    }

    const source: Source = {
      id: uuid(),
      team_id: team.teamId,
      address: payload.address,
      source_name: payload.source_name.trim(),
      chain_id: payload.chain_id,
      type: SOURCE_TYPE.CONTRACT,
      symbol: erc721Details.symbol,
      createdAt: Time.now(),
    };
    await createSources(source);

    // create a background job to fetch the audiences from the contract
    const job = await BackgroundJobs.create();
    const asyncInvokeResult = await new Lambda()
      .invokeAsync({
        FunctionName: process.env
          .ARN_LAMBDA_FOR_BACKGROUND_PROCESSING as string,
        InvokeArgs: JSON.stringify({
          contractAddress: source.address,
          team_id: team.teamId,
          chain_id: source.chain_id,
          source: source.source_name,
          sourceId: source.id,
          job_id: job.id,
        }),
      })
      .promise();

    if (asyncInvokeResult.$response.error) {
      throw new Error(asyncInvokeResult.$response.error.message);
    }

    return apiResponse(200, JSON.stringify({ id: source.id, jobId: job.id }));
  }

  return apiResponse(
    200,
    JSON.stringify({
      error: `Duplicate address. Address ${payload.address} already present in the database.`,
    })
  );
};

export const handler: any = middlewares(ivplementation);
