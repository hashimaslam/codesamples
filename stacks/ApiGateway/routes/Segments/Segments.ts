import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { Post } from "./Post/Post";
import { List } from "./List/List";
import { Put } from "./Put/Put";
import { Delete } from "./Delete/Delete";
import { Get } from "./Get/Get";

export class Segments extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Get(this, "Get", {
      api: props.api,
    });

    new Post(this, "Post", {
      api: props.api,
    });

    new List(this, "List", {
      api: props.api,
    });

    new Put(this, "Put", {
      api: props.api,
    });

    new Delete(this, "Delete", {
      api: props.api,
    });
  }
}
