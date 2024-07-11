import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, StreamViewType } from "aws-cdk-lib/aws-dynamodb";
import { Table } from "../../shared/constructs/Table";
import { OpenSearchStream } from "./OpenSearchStream/OpenSearchStream";

export class DB extends Stack {
  public tableCollections: Table;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.createCollectionsTable();
    this.crateTevplatesTable();
    this.crateTokensTable();
    this.createWalletConnectionsTable();
    this.createTeamsTable();
    this.createTeamConfigurationsTable();
    this.createTeamMembersTable();
    this.createUsersTable();
    this.createTokenOrdersTable();
    this.createBackgroundJobsTable();
    this.createBackgroundJobErrorsTable();
    this.createAllowListsTable();
    this.createAllowListItemsTable();
    this.createAudiencesTable();
    this.createSourceTable();
    this.createNotesTable();
    this.createSegmentsTable();
    this.createSegmentMembersTable();
    this.createFormsTable();
    this.createAirdropTable();
  }

  private createCollectionsTable() {
    this.tableCollections = new Table(this, "Collections", {
      partitionKey: {
        name: "id", // UUID of the connection entity
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // Allow querying all collections by "who created them"
    this.tableCollections.addGlobalSecondaryIndex({
      indexName: "user_id",
      partitionKey: {
        name: "user_id",
        type: AttributeType.STRING,
      },
    });
    // Allow querying all collections by "which team they are attached to"
    this.tableCollections.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });

    this.tableCollections.addGlobalSecondaryIndex({
      indexName: "address",
      partitionKey: {
        name: "address",
        type: AttributeType.STRING,
      },
    });

    this.tableCollections.addGlobalSecondaryIndex({
      indexName: "deploy_date",
      partitionKey: {
        name: "deploy_date",
        type: AttributeType.NUMBER,
      },
    });
  }

  private crateTevplatesTable() {
    const tableTevplates = new Table(this, "Tevplates", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });

    tableTevplates.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });
  }

  private crateTokensTable() {
    const tableTokens = new Table(this, "Tokens", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });

    tableTokens.addGlobalSecondaryIndex({
      indexName: "collection_id",
      partitionKey: {
        name: "collection_id",
        type: AttributeType.STRING,
      },
    });

    tableTokens.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });

    tableTokens.addGlobalSecondaryIndex({
      indexName: "token_id",
      partitionKey: {
        name: "tokenID",
        type: AttributeType.NUMBER,
      },
    });

    tableTokens.addGlobalSecondaryIndex({
      indexName: "minted_date",
      partitionKey: {
        name: "minted_date",
        type: AttributeType.NUMBER,
      },
    });
  }

  private createWalletConnectionsTable() {
    const tableWalletConnections = new Table(this, "Wallet-Connections", {
      partitionKey: {
        name: "id", // UUID of the connection entity
        type: AttributeType.STRING,
      },
    });

    // Allow querying all connections by "who created them"
    tableWalletConnections.addGlobalSecondaryIndex({
      indexName: "user_id",
      partitionKey: {
        name: "user_id",
        type: AttributeType.STRING,
      },
    });
    // Allow querying all connections by "which team they are attached to"
    tableWalletConnections.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createTeamsTable() {
    new Table(this, "Teams", {
      partitionKey: {
        name: "id", // UUID of the team entity
        type: AttributeType.STRING,
      },
    });
  }

  private createTeamMembersTable() {
    const table = new Table(this, "Team-Members", {
      partitionKey: {
        name: "team_id", // UUID of the team entity
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "member_id",
        type: AttributeType.STRING,
      },
    });

    // Allow retrieving all team(s) where the provided member_id is a part of
    // At the beginning this will always be one team, but we don't know how the business will evolve in the future
    table.addGlobalSecondaryIndex({
      indexName: "member_id",
      partitionKey: {
        name: "member_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createUsersTable() {
    const table = new Table(this, "Users", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });
    table.addGlobalSecondaryIndex({
      indexName: "email",
      partitionKey: {
        name: "email",
        type: AttributeType.STRING,
      },
    });
  }

  private createTokenOrdersTable() {
    const tableTokenOrders = new Table(this, "Token-Orders", {
      partitionKey: {
        name: "id", // UUID of the order entity
        type: AttributeType.STRING,
      },
    });

    tableTokenOrders.addGlobalSecondaryIndex({
      indexName: "collection_id",
      partitionKey: {
        name: "collection_id",
        type: AttributeType.STRING,
      },
    });

    tableTokenOrders.addGlobalSecondaryIndex({
      indexName: "tx_hash",
      partitionKey: {
        name: "tx_hash",
        type: AttributeType.STRING,
      },
    });

    tableTokenOrders.addGlobalSecondaryIndex({
      indexName: "status",
      partitionKey: {
        name: "status",
        type: AttributeType.STRING,
      },
    });
  }

  private createTeamConfigurationsTable() {
    new Table(this, "Team-Configurations", {
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "key",
        type: AttributeType.STRING,
      },
      // Values are always stored in a field called "value", but we don't need to add an index for that here
    });
  }

  private createBackgroundJobsTable() {
    new Table(this, "Background-Jobs", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      // Purge job records after their TTL timestamp is reached
      // Otherwise we would need a manual garbage collection process
      timeToLiveAttribute: "ttl",
    });
  }

  private createBackgroundJobErrorsTable() {
    const tableJobErrors = new Table(this, "Background-Job-Errors", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      // Purge job records after their TTL timestamp is reached
      // Otherwise we would need a manual garbage collection process
      timeToLiveAttribute: "ttl",
    });
    tableJobErrors.addGlobalSecondaryIndex({
      indexName: "jobId",
      partitionKey: {
        name: "jobId",
        type: AttributeType.STRING,
      },
    });
  }

  private createAllowListsTable() {
    const tableAllowLists = new Table(this, "Allow-Lists", {
      partitionKey: {
        name: "id", // UUID of the list
        type: AttributeType.STRING,
      },
    });
    // Allow querying all lists by collection
    tableAllowLists.addGlobalSecondaryIndex({
      indexName: "collection_id",
      partitionKey: {
        name: "collection_id",
        type: AttributeType.STRING,
      },
    });
    // Allow querying all lists by "team id"
    tableAllowLists.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createAllowListItemsTable() {
    const tableAllowListItems = new Table(this, "Allow-List-Items", {
      partitionKey: {
        name: "id", // UUID of the list item
        type: AttributeType.STRING,
      },
    });
    tableAllowListItems.addGlobalSecondaryIndex({
      indexName: "allow_list_id",
      partitionKey: {
        name: "allow_list_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createAudiencesTable() {
    const tableAudience = new Table(this, "Audiences", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new OpenSearchStream(tableAudience, "OpenSearchStream", {
      table: tableAudience,
      pkField: "id",
    });

    tableAudience.addGlobalSecondaryIndex({
      indexName: "address",
      partitionKey: {
        name: "address",
        type: AttributeType.STRING,
      },
    });

    // Allow querying all audiences by team
    tableAudience.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createSourceTable() {
    const tableSource = new Table(this, "Sources", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new OpenSearchStream(tableSource, "OpenSearchStream", {
      table: tableSource,
      pkField: "id",
    });

    tableSource.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });

    tableSource.addGlobalSecondaryIndex({
      indexName: "address",
      partitionKey: {
        name: "address",
        type: AttributeType.STRING,
      },
    });
  }

  private createNotesTable() {
    const tableNotes = new Table(this, "Notes", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });

    tableNotes.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });

    tableNotes.addGlobalSecondaryIndex({
      indexName: "audience_id",
      partitionKey: {
        name: "audience_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createSegmentsTable() {
    const tableSegments = new Table(this, "Segments", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new OpenSearchStream(tableSegments, "OpenSearchStream", {
      table: tableSegments,
      pkField: "id",
    });

    tableSegments.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createSegmentMembersTable() {
    const tableSegmentMembers = new Table(this, "SegmentMembers", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new OpenSearchStream(tableSegmentMembers, "OpenSearchStream", {
      table: tableSegmentMembers,
      pkField: "id",
    });

    tableSegmentMembers.addGlobalSecondaryIndex({
      indexName: "segment_id",
      partitionKey: {
        name: "segment_id",
        type: AttributeType.STRING,
      },
    });

    tableSegmentMembers.addGlobalSecondaryIndex({
      indexName: "audience_id",
      partitionKey: {
        name: "audience_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createFormsTable() {
    const tableForms = new Table(this, "Forms", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new OpenSearchStream(tableForms, "OpenSearchStream", {
      table: tableForms,
      pkField: "id",
    });

    tableForms.addGlobalSecondaryIndex({
      indexName: "team_id",
      partitionKey: {
        name: "team_id",
        type: AttributeType.STRING,
      },
    });
  }

  private createAirdropTable() {
    const tableForms = new Table(this, "Airdrops", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    tableForms.addGlobalSecondaryIndex({
      indexName: "collection_id",
      partitionKey: {
        name: "collection_id",
        type: AttributeType.STRING,
      },
    });
  }
}
