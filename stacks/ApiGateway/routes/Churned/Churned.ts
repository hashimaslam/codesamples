import { Construct } from "constructs";
import { List } from "./List/List";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { ExportCsv } from "./ExportCsv/ExportCsv";

export class Churned extends Construct {
  constructor(scope: Construct, id: string, private props: { api: IRestApi }) {
    super(scope, id);

    new List(this, "List", { api: props.api });
    new ExportCsv(this, "ExportCsv", { api: props.api });
  }
}
