import { Construct } from "constructs";
import { Create } from "./Create/Create";
import { Get } from "../Tevplates/Get/Get";
import { List } from "./List/List";
import { AuthorizedRestApi } from "../../AuthorizedRestApi";
import { Delete } from "./Delete/Delete";
import { Update } from "./Update/Update";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";

export class Tevplates extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new Create(this, "Create", {
      api: props.api,
    });

    new Get(this, "Get", {
      api: props.api,
    });

    new List(this, "List", {
      api: props.api,
    });

    new Delete(this, "Delete", {
      api: props.api,
    });

    new Update(this, "Update", {
      api: props.api,
    });
  }
}
