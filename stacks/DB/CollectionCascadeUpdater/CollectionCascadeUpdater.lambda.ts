import { DynamoDBStreamEvent } from "aws-lambda";
import {
  getTokensByCollection,
  updateToken,
} from "../../ApiGateway/routes/Tokens/utils/Tokens";
import { Token } from "../../ApiGateway/routes/Tokens/utils/Tokens.types";
import {
  updateAllowList,
  getAllowListsByCollectionId,
} from "../../ApiGateway/routes/AllowLists/utils/AllowLists";
import { AllowList } from "../../ApiGateway/routes/AllowLists/utils/AllowLists.types";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (record.eventName === "MODIFY") {
      const attrsOld = unmarshall(
        record.dynamodb?.OldImage! as Record<string, AttributeValue>
      );
      const attrsNew = unmarshall(
        record.dynamodb?.NewImage! as Record<string, AttributeValue>
      );
      const keys = unmarshall(
        record.dynamodb?.Keys! as Record<string, AttributeValue>
      );
      if (attrsOld.name !== attrsNew.name) {
        //console.log("CollectionID:", keys.id);
        const tokens: Token[] = await getTokensByCollection(keys.id);
        for (const token of tokens) {
          token.collection_name = attrsNew.name;
          await updateToken(token);
        }
        const allowlists: AllowList[] = await getAllowListsByCollectionId(
          keys.id
        );
        for (const alist of allowlists) {
          alist.collection_name = attrsNew.name;
          await updateAllowList(alist);
        }
      }
    }
  }
};
