import { Construct } from "constructs";
import { ValidateCSV } from "./ValidateCSV/ValidateCSV";
import { List } from "./List/List";
import { ExportCsv } from "./ExportCsv/ExportCsv";
import { Post } from "./Post/Post";
import { GetFilterItems } from "./GetFilterItems/GetFilterItems";
import { PutBulkTags } from "./PutBulkTags/PutBulkTags";
import { ImportCsvJob } from "./ImportCsvJob/ImportCsvJob";
import { ValidateAddress } from "./ValidateAddress/ValidateAddress";
import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { UpdateSingle } from "./UpdateSingle/UpdateSingle";
import { Notes } from "./Notes/Notes";
import { Get } from "./Get/Get";
import { AudiencesHoldings } from "./AudiencesHoldings/AudiencesHoldings";

export class Audiences extends Construct {
  constructor(
    scope: Construct,
    id: string,
    private props: {
      api: IRestApi;
    }
  ) {
    super(scope, id);

    new ValidateCSV(this, "ValidateCSV", { api: props.api });
    new ImportCsvJob(this, "ImportCSV", { api: props.api });
    new GetFilterItems(this, "GetItems", { api: props.api });

    new List(this, "List", {
      api: props.api,
    });

    new ExportCsv(this, "ExportCsv", {
      api: props.api,
    });

    new ValidateAddress(this, "ValidateAddress", { api: props.api });
    new PutBulkTags(this, "PutBulkTags", { api: props.api });

    new Post(this, "Post", { api: props.api });
    new UpdateSingle(this, "UpdateSingle", { api: props.api });

    new Get(this, "Get", { api: props.api });

    new Notes(this, "Note", { api: props.api });

    new AudiencesHoldings(this, "AudiencesHoldings", { api: props.api });
  }
}
