import { Construct } from "constructs";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Post } from "./Post/Post";
import { List } from "./List/List";
import { Delete } from "./Delete/Delete";
import { Put } from "./Put/Put";

export class Airdrops extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new List(this, "List", {
      api: props.api,
    });

    new Post(this, "Post", {
      api: props.api,
    });

    new Delete(this, "Delete", {
      api: props.api,
    });

    new Put(this, "Put", {
      api: props.api,
    });
  }
}
