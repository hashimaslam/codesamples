import { Covalent } from "../../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import * as fs from "fs";
import { LogEvent } from "@covalenthq/client-sdk";
import { NftOwnershipSummary } from "../NftOwnershipSummary";

const SAvplE_WALLET = "0x7457aF807b290c7B8E0FDA33ea7F075472301D6F";
const SAvplE_COLLECTION_ADDRESS =
  "0x1287e48129498719b51ea72882761fa581278Dbd".toLowerCase();
const SAvplE_TX =
  "0x1287e48129498719b51ea72882761fa581278dbd?a=0x7457af807b290c7b8e0fda33ea7f075472301d6f".toLowerCase();
const CHAIN_ID = 137; //Polygon

describe("ChurnedUsers.lambda.matic.test.ts", () => {
  jest.setTimeout(1000 * 60 * 5);

  beforeEach(() => {
    polyfillsForDebugging();
  });

  it("can find the latest NFT transaction for a whale wallet", async () => {
    const summary = await new NftOwnershipSummary(CHAIN_ID).getSummary(
      SAvplE_WALLET,
      SAvplE_COLLECTION_ADDRESS
    );

    const ownedTokensIds = summary
      .filter((x) => !x.soldAtUnixTimestamp)
      .map((x) => {
        return x.tokenId;
      });
    console.log("Currently owned tokens by this wallet: ", ownedTokensIds);
  });

  it("CHURN custom collection", async () => {
    const covalent = new Covalent(CHAIN_ID);
    const transactions = await covalent.getTransactions(SAvplE_WALLET);

    // START
    const interestingLogEvents: LogEvent[] = [];

    for await (let transaction of transactions) {
      if (transaction.tx_hash.toLowerCase() === SAvplE_TX) {
        console.log(JSON.stringify(transaction, null, 2));
      }

      const logEvents: LogEvent[] = transaction.log_events ?? [];
      logEvents
        // Ignore transactions that don't have a "decoded" object
        .filter((x) => !!x.decoded)

        // Ignore logs that don't have an NFT Transfer event in them
        .filter((x) => x.decoded.name === "Transfer")
        // Ignore logs that aren't from this NFT collection
        .filter(
          (x) => x.sender_address.toLowerCase() === SAvplE_COLLECTION_ADDRESS
        )
        .map((x) => interestingLogEvents.push(x));
    }
    interestingLogEvents.sort((a, b) => a.log_offset - b.log_offset);
    fs.mkdirSync("./log-events", { recursive: true });
    fs.writeFileSync(
      `./log-events/interesting-log-events.json`,
      JSON.stringify(interestingLogEvents, null, 2)
    );
  });

  // @TODO Use this to investigate why we're not getting some of the transactions where NFT movements happen
  it("can find NFT holdings for collection owner", async () => {
    const summary = await new NftOwnershipSummary(1).getSummary(
      SAvplE_WALLET,
      SAvplE_COLLECTION_ADDRESS
    );

    const ownedTokensIds = summary
      .filter((x) => !x.soldAtUnixTimestamp)
      .map((x) => {
        return x.tokenId;
      });
    console.log("summary", JSON.stringify(summary, null, 2));
    console.log("Currently owned tokens by this wallet: ", ownedTokensIds);
  });
});

function polyfillsForDebugging() {
  // Hack to make BigInts JSON serializable
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  try {
    fs.mkdirSync("./log-events/blocks", { recursive: true });
    fs.mkdirSync("./log-events/transactions", { recursive: true });
  } catch (e) {}
}
