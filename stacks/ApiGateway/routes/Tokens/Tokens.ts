import { Construct } from "constructs";
import { Get } from "./Get/Get";
import { List } from "./List/List";
import { Post } from "./Post/Post";
import { Put } from "./Put/Put";
import { Bulk } from "./Bulk/Bulk";
import { Clone } from "./Clone/Clone";
import { Delete } from "./Delete/Delete";
import { PreMint } from "./Mint/PreMint/PreMint";
import { SentMint } from "./Mint/SentMint/SentMint";
import { PostMint } from "./Mint/PostMint/PostMint";
import { Metadata } from "./Metadata/Metadata";
import { Buy } from "./BuyStripe/Buy/Buy";
import { Webhook } from "./BuyStripe/Webhook/Webhook";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { ListTokenOrders } from "./ListTokenOrders/ListTokenOrders";
import { GetPriceFeed } from "./GetPriceFeed/GetPriceFeed";
import { TransferSent } from "./BuyStripe/TransferSent/TransferSent";
import { Transferred } from "./BuyStripe/Transferred/Transferred";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Tokens extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Get(this, "Get", {
      api: props.api,
    });

    new List(this, "List", {
      api: props.api,
    });

    new Post(this, "Post", {
      api: props.api,
    });

    new Put(this, "Put", {
      api: props.api,
    });

    new Bulk(this, "Bulk", {
      api: props.api,
    });

    new Clone(this, "Clone", {
      api: props.api,
    });

    new Delete(this, "Delete", {
      api: props.api,
    });

    new PreMint(this, "PreMint", {
      api: props.api,
    });

    new SentMint(this, "SentMint", {
      api: props.api,
    });

    new PostMint(this, "PostMint", {
      api: props.api,
    });

    new Metadata(this, "Metadata", {
      api: props.api,
    });

    new Buy(this, "Buy", {
      api: props.api,
    });

    new TransferSent(this, "TransferSent", {
      api: props.api,
    });

    new Transferred(this, "Transferred", {
      api: props.api,
    });

    new Webhook(this, "Webhook", {
      api: props.api,
    });

    new ListTokenOrders(this, "ListTokenOrders", {
      api: props.api,
    });

    new GetPriceFeed(this, "GetPriceFeed", {
      api: props.api,
    });
  }
}
