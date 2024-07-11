import { Construct } from "constructs";
import { List } from "./List/List";
import { Get } from "./Get/Get";
import { Post } from "./Post/Post";
import { Put } from "./Put/Put";
import { Clone } from "./Clone/Clone";
import { Delete } from "./Delete/Delete";
import { SentDeploy } from "./Deploy/SentDeploy/SentDeploy";
import { PostDeploy } from "./Deploy/PostDeploy/PostDeploy";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { ContractMetadata } from "./ContractMetadata/ContractMetadata";
import { GetCheckoutInfo } from "./GetCheckoutInfo/GetCheckoutInfo";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Collections extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new ContractMetadata(this, "ContractMetadata", {
      api: this.props.api,
    });

    new List(this, "List", {
      api: props.api,
    });

    new Get(this, "Get", {
      api: props.api,
    });

    new Post(this, "Post", {
      api: props.api,
    });

    new Put(this, "Put", {
      api: props.api,
    });

    new Clone(this, "Clone", {
      api: props.api,
    });

    new Delete(this, "Delete", {
      api: props.api,
    });

    new PostDeploy(this, "PostDeploy", {
      api: props.api,
    });

    new SentDeploy(this, "SentDeploy", {
      api: props.api,
    });

    new GetCheckoutInfo(this, "GetCheckoutInfo", {
      api: props.api,
    });
  }
}
