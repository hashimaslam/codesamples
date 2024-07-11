import { Construct } from "constructs";
import { ValidateAddress } from "./ValidateAddress/ValidateAddress";
import { Post } from "./Post/Post";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { List } from "./List/List";
import { Delete } from "./Delete/Delete";
import { ValidateName } from "./ValidateName/ValidateName";
import { Put } from "./Put/Put";
import { ListSymbol } from "./ListSymbol/ListSymbol";
import { Get } from "./Get/Get";

export class Sources extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new ValidateAddress(this, "ValidateAddress", { api: props.api });

    new ValidateName(this, "ValidateName", { api: props.api });

    new List(this, "List", { api: props.api });

    new Post(this, "Post", { api: props.api });

    new Put(this, "Put", { api: props.api });

    new Delete(this, "Delete", { api: props.api });

    new ListSymbol(this, "ListSymbols", { api: props.api });

    new Get(this, "Get", { api: props.api });
  }
}
