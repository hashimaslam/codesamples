import { Covalent } from "../../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import * as fs from "fs";
import { LogEvent } from "@covalenthq/client-sdk";
import { NftOwnershipSummary } from "../NftOwnershipSummary";

describe("ChurnedUsers.lambda.eth.test.ts", () => {
  jest.setTimeout(1000 * 60 * 5);

  beforeEach(() => {
    polyfillsForDebugging();
  });

  it("can find the latest NFT transaction for a whale wallet", async () => {
    const SAvplE_WALLET = "0x2a85df477fe35d20e016dd81e6a6642d7eec4dfa";
    const SAvplE_COLLECTION_ADDRESS =
      "0x60E4d786628Fea6478F785A6d7e704777c86a7c6".toLowerCase(); // Mutant Ape Yacht Club

    const summary = await new NftOwnershipSummary(1).getSummary(
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

  it("Azuki", async () => {
    const SAvplE_WALLET = "0xc6F7D115c7C42e9404EF49eFf7Ab08e680Ab1B5c";
    const SAvplE_COLLECTION_ADDRESS =
      "0xED5AF388653567Af2F388E6224dC7C4b3241C544".toLowerCase();

    const chainId = 1;

    const covalent = new Covalent(chainId);
    const walletLowercase = SAvplE_WALLET.toLowerCase();

    const transactions = await covalent.getTransactions(walletLowercase);

    // START
    const interestingLogEvents: LogEvent[] = [];

    for await (let transaction of transactions) {
      if (
        transaction.tx_hash.toLowerCase() ===
        "0x3f967096695661810b0e92d2eff9d184a08f7b00f28f037c1a2f08ca66041345".toLowerCase()
      ) {
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
          (x) =>
            x.sender_address.toLowerCase() ===
            SAvplE_COLLECTION_ADDRESS.toLowerCase()
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
  it("can find NFT holdings for an Azuki owner", async () => {
    const wallet = "0xc6F7D115c7C42e9404EF49eFf7Ab08e680Ab1B5c"; // guccidyor.eth
    const collectionAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544";

    const summary = await new NftOwnershipSummary(1).getSummary(
      wallet,
      collectionAddress
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
