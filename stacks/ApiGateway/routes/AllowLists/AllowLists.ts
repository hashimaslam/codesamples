import { Construct } from "constructs";
import { Post } from "./Post/Post";
import { Delete } from "./Delete/Delete";
import { Validate } from "./Validate/Validate";
import { List } from "./List/List";
import { Put } from "./Put/Put";
import { Get } from "./Get/Get";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class AllowLists extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

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

    new Validate(this, "Validate", {
      api: props.api,
    });

    new Get(this, "Get", {
      api: props.api,
    });
  }
}
