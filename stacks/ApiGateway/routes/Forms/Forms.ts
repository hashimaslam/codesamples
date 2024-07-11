import { Construct } from "constructs";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { Post } from "./Post/Post";
import { List } from "./List/List";
import { Get } from "./Get/Get";
import { Delete } from "./Delete/Delete";
import { Put } from "./Put/Put";
import { PublicFormView } from "./PublicFormView/PublicFormView";
import { UnpublishForm } from "./UnpublishForm/UnpublishForm";
import { SubmitForm } from "./SubmitForm/SubmitForm";

export class Forms extends Construct {
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

    new Put(this, "Put", {
      api: props.api,
    });

    new List(this, "List", {
      api: props.api,
    });

    new Get(this, "Get", {
      api: props.api,
    });

    new Delete(this, "Delete", {
      api: props.api,
    });

    new PublicFormView(this, "PublicFormView", {
      api: props.api,
    });

    new UnpublishForm(this, "UnpublishForm", {
      api: props.api,
    });

    new SubmitForm(this, "SubmitForm", {
      api: props.api,
    });
  }
}
