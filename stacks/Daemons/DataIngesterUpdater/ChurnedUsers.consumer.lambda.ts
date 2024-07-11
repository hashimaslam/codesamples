import { SQSHandler, SQSRecord } from "aws-lambda";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";
import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Source } from "../../ApiGateway/routes/Sources/utils/Sources.types";
import { getAudiencesListByFilter } from "../../ApiGateway/routes/Audiences/utils/Audiences";
import {
  Covalent,
  getAllTransactions,
} from "../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import { getCheckSumAddress } from "../../../shared/utils/Web3";
import { Audience } from "../../ApiGateway/routes/Audiences/utils/Audiences.types";
import { putBatchItems } from "../../../shared/utils/DynamoDB";
import { TableNames } from "../../../shared/utils/TableNames";

const sqs = new SQSClient({});

async function markSqsCovpleted(record: SQSRecord) {
  await sqs.send(
    new DeleteMessageCommand({
      QueueUrl: process.env.SQS_CHURNED_QUEUE_URL as string,
      ReceiptHandle: record.receiptHandle as string,
    })
  );
}

export const handler: SQSHandler = async (event) => {
  for (let record of event.Records) {
    try {
      const source: Source = JSON.parse(record.body);

      // All future logs/errors will include this extra information, to help with debugging
      getLogger().appendKeys({
        address: source.address,
        chainId: source.chain_id!,
      });

      const covalent = new Covalent(source.chain_id!);
      const collectionAddress = getCheckSumAddress(source.address!);
      const transactions: any[] = await getAllTransactions(
        collectionAddress,
        source.chain_id!
      );
      const { data } = await getAudiencesListByFilter(
        {
          sourceId: [source.id!],
        },
        source.team_id!
      );
      const batch: Audience[] = [];

      for (const audience of data) {
        let totalOwned = 0;
        let churnedAt: number = 0;
        let hadSomeTokens = false;
        for (let transaction of transactions) {
          (transaction.log_events ?? [])
            .filter((x: any) =>
              ["Transfer", "TokensMinted", "TransferBatch"].includes(
                x.decoded?.name
              )
            )
            //Notice Burn transactions will have param "to" = 0x address
            .forEach((x: any) => {
              const from = x.decoded.params.find(
                (x: any) => x.name === "from"
              )?.value;
              const to = x.decoded.params.find(
                (x: any) => x.name === "to"
              )?.value;
              const mintedTo = x.decoded.params.find(
                (x: any) => x.name === "mintedTo"
              )?.value;

              let isSender = false;
              let isRecipient = false;
              if (mintedTo) {
                isRecipient =
                  audience.address! === getCheckSumAddress(mintedTo);
              } else if (to) {
                isSender = audience.address! === getCheckSumAddress(from!);
                isRecipient = audience.address! === getCheckSumAddress(to);
              }

              if (!isSender && !isRecipient) {
                // The provided wallet is neither the sender nor recipient of this NFT transfer
                return;
              }
              hadSomeTokens = true;

              if (x.decoded.name === "TransferBatch") {
                const amounts: any | undefined = x.decoded.params.find(
                  (x: any) => x.name === "_amounts"
                );
                if (amounts) {
                  //Trans
                  for (let i = 0, l = amounts.value.length; i < l; i++) {
                    if (isSender) {
                      totalOwned -= Number(amounts.value[i].value);
                    } else {
                      totalOwned += Number(amounts.value[i].value);
                    }
                  }
                }
              } else if (
                x.decoded.name === "Transfer" ||
                x.decoded.name === "TokensMinted"
              ) {
                const tokenId = x.decoded.params.find(
                  (x: any) => x.name === "tokenId"
                )?.value;
                if (tokenId) {
                  if (isSender) {
                    totalOwned--;
                  } else {
                    totalOwned++;
                  }
                }
                const tokenIdMinted = x.decoded.params.find(
                  (x: any) => x.name === "tokenIdMinted"
                )?.value;
                if (tokenIdMinted) {
                  const amount = x.decoded.params.find(
                    (x: any) => x.name === "value"
                  )?.value;
                  if (amount) {
                    totalOwned += Number(amount);
                  }
                }
              }
              if (isSender) {
                const newChurnedAt = Date.parse(x.block_signed_at) / 1000;
                if (newChurnedAt > churnedAt) {
                  churnedAt = newChurnedAt;
                }
              }
            });
        }
        if (hadSomeTokens) {
          getLogger().info(
            `Wallet ${audience.address} had some tokens in collection ${collectionAddress} historically`,
            {
              audience: audience.address,
              collectionAddress,
              chainId: source.chain_id,
            }
          );
          const ownings = await covalent.checkOwnershipInNft(
            audience.address!,
            collectionAddress
          );

          const items = ownings.data.items;

          let owned: bigint = BigInt(0);
          for (const item of items) {
            if (item.balance !== null) {
              owned += item.balance;
            }
          }

          if (owned.valueOf() === BigInt(0)) {
            if (audience.churned_at !== churnedAt) {
              audience.churned_at = churnedAt;
              batch.push(audience);
            }
          } else {
            if (audience.churned_at) {
              audience.churned_at = undefined;
              batch.push(audience);
            }
          }
        }
      }

      await putBatchItems(await TableNames.audiences(), batch);
    } catch (e: any) {
      getLogger().error(e);
    }
    await markSqsCovpleted(record);
  }
};
