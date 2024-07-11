import { Construct } from "constructs";
import { List } from "./List/List";
import { Create } from "./Create/Create";
import { Invites } from "./Invites/Invites";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { Delete } from "./Delete/Delete";
import { Get } from "./Get/Get";
import { Update } from "./Update/Update";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Users extends Construct {
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
    new Update(this, "Update", {
      api: props.api,
    });
    new List(this, "List", {
      api: props.api,
    });
    new Create(this, "Create", {
      api: props.api,
    });
    new Delete(this, "Delete", {
      api: props.api,
    });
    new Invites(this, "Invites", {
      api: props.api,
    });
  }
}
