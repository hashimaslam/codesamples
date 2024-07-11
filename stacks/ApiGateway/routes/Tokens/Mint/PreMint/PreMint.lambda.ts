import { isAddress } from "ethers/lib/utils";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { Token } from "../../utils/Tokens.types";
import { generateMetadata, getTokenById } from "../../utils/Tokens";
import { getCollectionById } from "../../../Collections/utils/Collections";
import axios from "axios";
import { getFileStream } from "../../../Storage/utils/Storage";
import { Collection } from "../../../Collections/utils/Collections.types";
import { SupportedContractTypes } from "../../../../../../shared/utils/Constants";
import { isValidChainId } from "../../../../../../shared/utils/Web3";
const FormData = require("form-data");

type RequestData = {
  chainId: number;
  walletaddress: string;
  ipfs?: boolean;
};

interface Request extends APIGatewayProxyEvent {}

const preMintToken = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot execute this operation",
      })
    );
  }

  const queries = event.pathParameters;
  const token_id = queries?.id;

  if (!token_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  const token: Token | undefined = await getTokenById(token_id);

  if (!token) {
    return apiResponse(
      400,
      JSON.stringify({ error: "This token does not exist in your team" })
    );
  }

  if (!token.image || token.image === "") {
    return apiResponse(
      400,
      JSON.stringify({ error: "This token has not an image associated" })
    );
  }

  const collection: Collection | undefined = await getCollectionById(
    token.collection_id as unknown as string
  );
  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not belong to a collection managed by your team",
      })
    );
  }

  if (token.mint_tx && token.mint_tx !== "" && token.minted_date! > 0) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          collection.contract_type === "nft-drop"
            ? "There is an already transaction on the way, you need to wait for it to be finished to send a new one."
            : "This token already has a mint transaction settled, so it is already in a mint process",
      })
    );
  }

  const { chainId, walletaddress, ipfs } = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as RequestData;

  if (!walletaddress || !isAddress(walletaddress)) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid 'owner address' provided" })
    );
  }

  if (!chainId || !isValidChainId(Number(chainId))) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid 'chainId' provided" })
    );
  }

  if (!collection.deploy_date) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `This collection contract is still not deployed to blockchain, so can't mint`,
      })
    );
  }

  if (collection.owner?.toLowerCase() !== walletaddress.toLowerCase()) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `This contract is not owned by ${walletaddress} so has not grants to mint`,
      })
    );
  }

  if (chainId !== collection.chain_id) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `Please select the right network: ${collection.chain_id}`,
      })
    );
  }

  if (ipfs && ipfs === true) {
    //Using IPFS storage instead of AWS storage

    if (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET) {
      return apiResponse(
        400,
        JSON.stringify({
          error:
            "Missing environment vars PINATA_API_KEY and/or PINATA_API_SECRET",
        })
      );
    }

    let imageURI;
    try {
      //https://docs.pinata.cloud/pinata-api/pinning/pin-file-or-directory
      //key is the object path
      const key = token.image;
      const data = await getFileStream(key);
      const formData = new FormData();
      formData.append("file", data.Body);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `${process.env.PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.PINATA_API_SECRET}`,
          //'Authorization': `${process.env.PINATA_JWT}`,
          ...formData.getHeaders(),
        },
      });

      imageURI = `ipfs://${resFile.data.IpfsHash}`;
    } catch (error) {
      console.error("Error sending image file to IPFS: ", error);
      return apiResponse(
        400,
        JSON.stringify({
          error: `Error uploading image file to IPFS: ${token.image}`,
          description: error,
        })
      );
    }

    try {
      const md = generateMetadata(
        token,
        imageURI,
        collection.contract_type as unknown as SupportedContractTypes
      );
      var jsonmd = JSON.stringify(md);
      //https://docs.pinata.cloud/pinata-api/pinning/pin-json
      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: `${process.env.PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.PINATA_API_SECRET}`,
          //'Authorization': `${process.env.PINATA_JWT}`,
        },
        data: jsonmd,
      };
      const mdFile = await axios(config);

      if (mdFile.data) {
        const metadata_IPFS_URI = `ipfs://${mdFile.data.IpfsHash}`;
        //const tokenURI = `https://${process.env.IPFS_GATEWAY}/ipfs/${mdFile.data.IpfsHash}`;
        return apiResponse(
          200,
          JSON.stringify({
            tokenURI: metadata_IPFS_URI,
            collection_address: collection.address,
          })
        );
      } else {
        console.error("Error uploading metadata IPFS: ");
        return apiResponse(
          400,
          JSON.stringify({
            error: `Error uploading metadata file to IPFS: ${token.name}`,
          })
        );
      }
    } catch (error) {
      console.error("Error sending metadata file to IPFS: ", error);
      return apiResponse(
        400,
        JSON.stringify({
          error: `Error uploading metadata file to IPFS: ${token.image}`,
          description: error,
        })
      );
    }
  } else {
    //Not using IPFS, just AWS storage
    const rootUrl = event.headers.Host as string;
    return apiResponse(
      200,
      JSON.stringify({
        tokenURI: `https://${rootUrl}/prod/tokens/metadata/${collection.id}/${
          collection.contract_type === "nft-drop" ? "" : token.id
        }`,
        collection_address: collection.address,
      })
    );
  }
};

export const handler: any = middlewares(preMintToken);
