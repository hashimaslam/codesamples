import { APIGatewayProxyEvent } from "aws-lambda";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { isAddress, isENS } from "../../../../../shared/utils/Web3";
import {
  Audience,
  AudienceChainData,
  AudienceFilters,
  AudienceHolding,
  AudienceModel,
  OS_MAX_PAGINATION_LIMIT,
  RangeFilters,
} from "./Audiences.types";
import { OpenSearchClient } from "../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { OpenSearchIndexManager } from "../../../../../shared/utils/OpenSearch/OpenSearchIndexManager";
import { batchDeleteItems } from "../../../../../shared/utils/DynamoDB";
import {
  formatShortDate,
  shortTimeAgo,
} from "../../../../../shared/utils/DateTime";

import {
  CHAIN_IDS,
  CHAIN_NAMES,
} from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { EMPTY_SEARCH_VALUE } from "../../../../../shared/utils/Constants";
import { DB } from "../../../../../shared/utils/DB";
import { removeDuplicates } from "../../../../../shared/utils/Common";
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDB } from "aws-sdk";

export async function isAudienceExist(
  aud_id: string,
  team_id: string
): Promise<Boolean> {
  const aud = await getAudienceById(aud_id);
  return aud?.team_id === team_id;
}

export function convertRangeFilterToOpenSearchObject(rangeFilter: {
  from?: number;
  to?: number;
  fieldName: string;
}) {
  if (rangeFilter.from !== undefined && rangeFilter.to !== undefined) {
    return {
      range: {
        [rangeFilter.fieldName]: {
          gte: rangeFilter.from,
          lte: rangeFilter.to,
        },
      },
    };
  }
  if (rangeFilter.from !== undefined) {
    return {
      range: {
        [rangeFilter.fieldName]: {
          gte: rangeFilter.from,
        },
      },
    };
  }
  if (rangeFilter.to !== undefined) {
    return {
      range: {
        [rangeFilter.fieldName]: {
          lte: rangeFilter.to,
        },
      },
    };
  }

  throw new Error(
    `The range filter for field ${rangeFilter.fieldName} is invalid. Either "from" or "to" or both are required.`
  );
}

export async function getAudienceById(
  aud_id: string
): Promise<Audience | undefined> {
  const result = await new DynamoDBClient().send(
    new GetItemCommand({
      TableName: await TableNames.audiences(),
      Key: {
        id: {
          S: aud_id,
        },
      },
    })
  );
  if (!result.Item) {
    return undefined;
  }
  return unmarshall(result.Item);
}

export async function isAddressPresentForATeam(
  address: string,
  teamId: string
): Promise<Audience[]> {
  try {
    const results = await new DynamoDBClient().send(
      new QueryCommand({
        TableName: await TableNames.audiences(),
        IndexName: "address",
        KeyConditionExpression: "address = :address",
        ExpressionAttributeValues: {
          ":address": {
            S: address,
          },
        },
      })
    );

    if (!results.Items) return [];
    else {
      const fAuds = results.Items.filter((x) => {
        const ele = unmarshall(x);
        return ele.team_id === teamId;
      });

      if (fAuds.length > 0) return fAuds.map((x) => unmarshall(x));
      else return [];
    }
  } catch (err) {
    throw new Error(`Something went wrong: ${err}`);
  }
}

export async function getAudiencesListByTeamFromDynamoDB(
  teamId?: string,
  pageSize?: number,
  startKey?: DynamoDB.Key
): Promise<Audience[]> {
  let totalResults: DynamoDB.ItemList = [];
  let results;
  let params: any;
  let lastEvaluatedKey = startKey;
  do {
    params = {
      TableName: await TableNames.audiences(),
      ExclusiveStartKey: lastEvaluatedKey,
      Limit: pageSize,
    };

    if (teamId) {
      params.IndexName = "team_id";
      params.KeyConditionExpression = "team_id = :team_id";
      params.ExpressionAttributeValues = {
        ":team_id": {
          S: teamId,
        },
      };
      results = await new DynamoDBClient().send(new QueryCommand(params));
    } else {
      results = await new DynamoDBClient().send(new ScanCommand(params));
    }

    if (results.Items) {
      totalResults = totalResults.concat(results.Items);
    }
    lastEvaluatedKey = results.LastEvaluatedKey;
  } while (!!results.LastEvaluatedKey && !params.Limit);
  return totalResults.map((x: any) => unmarshall(x));
}

export async function createAudienceIndexesIfNeeded() {
  const index = (await TableNames.audiences()).toLowerCase();
  await OpenSearchIndexManager.createIndexIfNeeded(index);
  const index3 = (await TableNames.segments()).toLowerCase();
  await OpenSearchIndexManager.createIndexIfNeeded(index3);
  const index4 = (await TableNames.sources()).toLowerCase();
  await OpenSearchIndexManager.createIndexIfNeeded(index4);
}

export async function removeAudienceIndexes() {
  const index = (await TableNames.audiences()).toLowerCase();
  await OpenSearchIndexManager.deleteIndex(index);
  const index3 = (await TableNames.segments()).toLowerCase();
  await OpenSearchIndexManager.deleteIndex(index3);
  const index4 = (await TableNames.sources()).toLowerCase();
  await OpenSearchIndexManager.deleteIndex(index4);
}

export async function createAudience(audience: Audience) {
  await DB.write(await TableNames.audiences(), audience);
  return {
    id: audience.id,
  };
}

export function getFiltersFromEvent(event: APIGatewayProxyEvent) {
  const filters: AudienceFilters = {
    sourceId: event.multiValueQueryStringParameters?.sourceId ?? [],
    searchText: event.queryStringParameters?.search,
    type: event.multiValueQueryStringParameters?.type ?? [],
    tags: event.multiValueQueryStringParameters?.tags ?? [],
    usdBalanceFrom: event.queryStringParameters?.usdBalanceFrom,
    usdBalanceTo: event.queryStringParameters?.usdBalanceTo,
    allTimeTransactionsFrom:
      event.queryStringParameters?.allTimeTransactionsFrom,
    allTimeTransactionsTo: event.queryStringParameters?.allTimeTransactionsTp,
    lastTransactionDateFrom:
      event.queryStringParameters?.lastTransactionDateFrom,
    lastTransactionDateTo: event.queryStringParameters?.lastTransactionDateTo,
    nftsFrom: event.queryStringParameters?.nftsFrom,
    nftsTo: event.queryStringParameters?.nftsTo,
  };
  return getFiltersFromParams(filters);
}

export function getFiltersFromParams(
  filters: AudienceFilters
): AudienceFilters {
  const type = filters.type ?? [];
  const tags = filters.tags ?? [];

  // filter range params
  const usdBalanceFrom = Number(filters.usdBalanceFrom as string);
  const usdBalanceTo = Number(filters.usdBalanceTo as string);

  const allTimeTransactionsFrom = Number(
    filters.allTimeTransactionsFrom as string
  );
  const allTimeTransactionsTo = Number(filters.allTimeTransactionsTo as string);

  const firstTransactionDateFrom = Number(
    filters.firstTransactionDateFrom as string
  );
  const firstTransactionDateTo = Number(
    filters.firstTransactionDateTo as string
  );

  const lastTransactionDateFrom = Number(
    filters.lastTransactionDateFrom as string
  );
  const lastTransactionDateTo = Number(filters.lastTransactionDateTo as string);

  const nftsFrom = Number(filters.nftsFrom as string);
  const nftsTo = Number(filters.nftsTo as string);

  const rangeFilters: RangeFilters[] = [
    {
      from: usdBalanceFrom,
      to: usdBalanceTo,
      fieldName: "usdBalance",
    },
    {
      from: allTimeTransactionsFrom,
      to: allTimeTransactionsTo,
      fieldName: "allTimeTransactions",
    },
    {
      from: firstTransactionDateFrom,
      to: firstTransactionDateTo,
      fieldName: "firstTransactionDate",
    },
    {
      from: lastTransactionDateFrom,
      to: lastTransactionDateTo,
      fieldName: "lastTransactionDate",
    },
    {
      from: nftsFrom,
      to: nftsTo,
      fieldName: "nfts",
    },
  ];

  return {
    sourceId: filters.sourceId,
    searchText: filters.searchText,
    type,
    tags,
    // Exclude range filters that have no from and to values,
    // because no constraining on either side just means no filter
    rangeFilters: rangeFilters.filter((x) => x.from || x.to),
  };
}

export async function getFullAudiencesListFromOpensearch(
  filters?: AudienceFilters,
  sortBy?: string[],
  teamId?: string,
  fieldsToInclude?: string[],
  audienceIds?: string[],
  churned?: boolean
): Promise<{
  data: Audience[];
  absoluteCount: number;
  aggregations: any;
}> {
  let audData: Audience[] = [];
  let count: number = 0;
  let absoluteCount: number = 0;
  let offset: number = 0;
  let aggregations: any = {};
  do {
    const auds = await getAudiencesFromOpensearch(
      filters,
      offset,
      OS_MAX_PAGINATION_LIMIT,
      sortBy,
      teamId,
      fieldsToInclude,
      audienceIds,
      churned
    );
    offset += OS_MAX_PAGINATION_LIMIT;

    audData = audData.concat(auds.data);
    if (count === 0) absoluteCount = auds.absoluteCount;
    count += auds.data.length;
    aggregations = cumulateAggregateDataForAudience(
      auds.aggregations,
      aggregations
    );
  } while (count < absoluteCount);

  return {
    data: audData,
    absoluteCount,
    aggregations,
  };
}

export function cumulateAggregateDataForAudience(objIn: any, data: any) {
  for (let key in objIn) {
    if (!(key.startsWith("min") || key.startsWith("max"))) {
      if (data[key]) {
        data[key].value += objIn[key].value;
      } else {
        data[key] = {
          value: objIn[key].value,
        };
      }
    }
  }
  return data;
}

/**
 * Recover the list of audiences matching the given filters
 * @param filters
 * @param from
 * @param size
 * @param sortBy
 * @param teamId
 * @param fieldsToInclude
 * @param audienceIds
 * @param churned
 * @returns List of audiences, aggregator values and total counter
 */
export async function getAudiencesFromOpensearch(
  filters?: AudienceFilters,
  from?: number,
  size?: number,
  sortBy?: string[],
  teamId?: string,
  fieldsToInclude?: string[],
  audienceIds?: string[],
  churned?: boolean
): Promise<{
  data: Audience[];
  absoluteCount: number;
  aggregations: any;
}> {
  await OpenSearchIndexManager.createIndexIfNeeded(
    (await TableNames.audiences()).toLowerCase()
  );

  if (size && size > OS_MAX_PAGINATION_LIMIT) {
    return await getFullAudiencesListFromOpensearch(
      filters,
      sortBy,
      teamId,
      fieldsToInclude,
      audienceIds,
      churned
    );
  }

  let body: any = {
    sort: [],
    from,
    query: {
      bool: {
        must: [{ match_all: {} }],
        must_not: [{ match_none: {} }],
      },
    },
    aggs: {},
    _source: [],
    track_total_hits: true,
  };

  if (size && size > 0) {
    body.size = size;
  }

  // check if the fields filter has been provided
  if (fieldsToInclude && fieldsToInclude.length > 0) {
    body._source = fieldsToInclude;
  }

  if (teamId) {
    // add filter with teamId
    body.query.bool["filter"] = [
      {
        term: {
          "team_id.keyword": teamId,
        },
      },
    ];
  }

  if (filters?.sourceId && filters?.sourceId.length > 0) {
    body.query.bool.must.push({
      bool: {
        should: filters.sourceId.map((sourceid) => ({
          term: {
            "source_ids.keyword": sourceid,
          },
        })),
      },
    });
  }

  if (churned !== undefined && churned === true) {
    // Only get audiences that have the "churned_at" field set
    if (!body.query.bool["filter"]) body.query.bool["filter"] = [];
    body.query.bool["filter"].push({
      exists: {
        field: "churned_at",
      },
    });
  }

  // add audience ids to match in the filters
  if (audienceIds && audienceIds.length > 0) {
    if (!body.query.bool["filter"]) body.query.bool["filter"] = [];
    body.query.bool["filter"].push({
      terms: {
        "id.keyword": audienceIds,
      },
    });
  }

  // add search context param
  if (filters?.searchText && filters.searchText.length > 0) {
    if (!body.query.bool["filter"]) body.query.bool["filter"] = [];
    body.query.bool["filter"].push({
      query_string: {
        query: `*${filters.searchText.trim().toLowerCase()}*`,
        fields: ["email", "ensName", "address", "sources"],
      },
    });
  }

  // add sort params(multiple sort params if applicable)
  if (sortBy && sortBy.length > 0) {
    const noSortFields = ["sources", "type", "tags", "address", "email"];
    const numberTypeFields = [
      "allTimeTransactions",
      "firstTransactionDate",
      "lastTransactionDate",
      "usdBalance",
      "nfts",
      "createdAt",
      "churned_at",
    ];

    sortBy.forEach((row) => {
      const splitVals = row.split(".");
      const sortField = splitVals[0];
      const sortDirection = splitVals[1];

      if (!noSortFields.includes(sortField)) {
        const sortByName =
          sortField.localeCompare("ensName") === 0
            ? "ensName_ignore_case"
            : sortField;
        const key =
          sortByName + (numberTypeFields.includes(sortField) ? "" : ".keyword");
        body.sort.push({
          [key]: {
            order: sortDirection,
          },
        });
      }
    });
  }

  // fetch the aggregated data on usdBalance and nfts
  body.aggs = getMinMaxForOpensearchQueryForAudience();

  if (filters) {
    if (filters.type && filters.type.length > 0) {
      if (filters.type.find((t) => t !== EMPTY_SEARCH_VALUE)) {
        body.query.bool.must.push({
          bool: {
            should: filters.type.map((type: string) => ({
              term: {
                "type.keyword": type,
              },
            })),
          },
        });
      } else {
        body.query.bool.must.push({
          exists: {
            field: "type",
          },
        });
        body.query.bool.must_not.push({
          wildcard: {
            type: "*",
          },
        });
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      if (filters.tags.find((t) => t !== EMPTY_SEARCH_VALUE)) {
        body.query.bool.must.push({
          bool: {
            should: filters.tags.map((tag: string) => ({
              term: {
                "tags.keyword": tag,
              },
            })),
          },
        });
      } else {
        body.query.bool.must_not.push({
          exists: {
            field: "tags",
          },
        });
      }
    }

    filters.rangeFilters?.forEach((rangeFilter) => {
      body.query.bool.must.push(
        convertRangeFilterToOpenSearchObject(rangeFilter)
      );
    });
  }

  const os = await OpenSearchClient.getInstance();
  const index = (await TableNames.audiences()).toLowerCase();
  //console.debug(`GET ${index}/_search `, JSON.stringify(body /*, null, "\t"*/));
  const result = await os.search({
    index,
    body,
  });

  return {
    data: result.body.hits.hits.map((x: any) => x._source),
    absoluteCount: result.body.hits.total.value,
    aggregations: result.body.aggregations,
  };
}

export function getMinMaxForOpensearchQueryForAudience() {
  const dummyAudience: Audience = {
    id: "string",
    team_id: "string",
    type: "string",
    tags: [""],
    email: "string",
    address: "string",
    sources: [""],
    source_ids: [""],
    social: "any",
    data: [],
    nfts: 0,
    usdBalance: 0,
    allTimeTransactions: 0,
    firstTransactionDate: 0,
    lastTransactionDate: 0,
    churned_at: 0,
    churned_duration: 0,
    createdAt: 0,
  };

  let obj: any = {
    cumulativeUSD: {
      sum: {
        field: "usdBalance",
      },
    },
    cumulativeNFT: {
      sum: {
        field: "nfts",
      },
    },
  };

  for (let key in dummyAudience) {
    if (typeof dummyAudience[key as AudienceModel] === "number") {
      obj["max_" + key] = {
        max: {
          field: key,
        },
      };
      obj["min_" + key] = {
        min: {
          field: key,
        },
      };
    }
  }

  return obj;
}

export function constructFiltersObject(filters: RangeFilters) {
  let obj: any = {};
  if (filters) {
    if (filters.from && filters.from >= 0) {
      obj = {
        range: {
          [filters.fieldName]: {
            gte: filters.from,
          },
        },
      };
    }

    if (filters.to && filters.to >= 0) {
      if (obj.range) {
        obj.range = {
          [filters.fieldName]: {
            gte: filters.from,
            lte: filters.to,
          },
        };
      } else {
        obj = {
          range: {
            [filters.fieldName]: {
              lte: filters.to,
            },
          },
        };
      }
    }
  }
  return obj;
}

export function reconcileAudiencesDBtoCSV(
  data: Audience[],
  includeChainData: boolean = false
): any[] {
  const ret: any[] = [];
  for (const audience of data) {
    let ftd = null;
    if (audience.firstTransactionDate && audience.firstTransactionDate > 0) {
      ftd = new Date(audience.firstTransactionDate * 1000);
    }
    let ltd = null;
    if (audience.lastTransactionDate && audience.lastTransactionDate > 0) {
      ltd = new Date(audience.lastTransactionDate * 1000);
    }

    let rAudience: any = {
      Address: audience.address,
      Email: audience.email,
      WalletAge: ftd === null ? undefined : shortTimeAgo(ftd),
      NFTPortfolio: audience.nfts,
      USDBalance: audience.usdBalance?.toLocaleString("fullwide", {
        useGrouping: false,
      }),
      Type: audience.type,
      Tags: audience.tags?.join(";"),
      Source: audience.sources?.join(";"),
      Transactions: audience.allTimeTransactions,
      FirstTransactionDate: ftd === null ? undefined : formatShortDate(ftd),
      LastTransactionDate: ltd === null ? undefined : formatShortDate(ltd),
    };

    if (includeChainData) {
      for (const chainId of CHAIN_IDS) {
        const chainName = CHAIN_NAMES[chainId];
        const aChainData = audience.data?.find(
          (d: AudienceChainData) => d.chainId === chainId
        );
        rAudience[`${chainName}_Balance`] =
          aChainData?.ethBalance?.toLocaleString("fullwide", {
            useGrouping: false,
          });
        rAudience[`${chainName}_USDBalance`] =
          aChainData?.usdBalance?.toLocaleString("fullwide", {
            useGrouping: false,
          });
        rAudience[`${chainName}_firstTransactionDate`] =
          aChainData?.firstTransactionDate;
        rAudience[`${chainName}_lastTransactionDate`] =
          aChainData?.lastTransactionDate;
        rAudience[`${chainName}_allTimeTransactions`] =
          aChainData?.allTimeTransactions;
      }
    }
    ret.push(rAudience);
  }
  return ret;
}

export async function validateAddress(
  address: string,
  teamId: string,
  chainId?: number
): Promise<[Boolean, string]> {
  if (await isAddress(address)) return [true, address];
  if (!chainId) return [false, ""];

  const resolvedAddress = await isENS(address, chainId, teamId);
  if (!resolvedAddress || resolvedAddress.error) return [false, ""];
  if (resolvedAddress.length > 0) return [true, resolvedAddress];

  return [false, ""];
}

export async function updateAudience(audience: any) {
  let updateExpression = "set";
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};
  for (const property in audience as Audience) {
    if (property === "id") continue;
    //if (!Boolean(audience[property])) continue;
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = audience[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.audiences(),
      Key: DynamoDB.Converter.marshall({
        id: audience.id,
      }),
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: DynamoDB.Converter.marshall(
        ExpressionAttributeValues
      ),
      ReturnValues: "UPDATED_NEW",
    })
    .promise();

  if (result.$response.error) {
    console.error(result.$response.error);
    throw new Error(result.$response.error.message);
  }

  return {
    id: audience.id,
    updated_attributes: result.Attributes
      ? DynamoDB.Converter.unmarshall(result.Attributes)
      : {},
  };
}

export async function updateAudienceSingleField(
  id: string,
  field: string,
  value: string | string[]
) {
  await new DynamoDBClient().send(
    new UpdateItemCommand({
      TableName: await TableNames.audiences(),
      Key: {
        id: {
          S: id,
        },
      },
      UpdateExpression: `SET #field = :value`,
      ExpressionAttributeNames: {
        "#field": field,
      },
      ExpressionAttributeValues: marshall(
        {
          ":value": value,
        },
        { removeUndefinedValues: true }
      ),
    })
  );
}

export async function addAudienceTags(audiences: Audience[], tags: string[]) {
  for (let i = 0; i < audiences.length; i++) {
    tags.forEach((t: string) => {
      if (!audiences[i].tags?.find((tag) => tag === t)) {
        audiences[i].tags?.push(t.trim());
      }
    });
    audiences[i].tags = removeDuplicates(audiences[i].tags || []);
  }

  await Promise.all(
    audiences.map(async (audience) => {
      const upd_audience = {
        id: audience.id,
        tags: audience.tags,
      };

      await updateAudience(upd_audience);
      return;
    })
  );
  return;
}

export async function removeAudienceTags(
  audiences: Audience[],
  tags: string[]
) {
  for (let i = 0; i < audiences.length; i++) {
    tags.forEach((t: string) => {
      if (audiences[i].tags?.find((tag) => tag === t)) {
        audiences[i].tags = audiences[i].tags?.filter((tag) => tag !== t);
      }
    });
  }

  await Promise.all(
    audiences.map(async (audience) => {
      const upd_audience = {
        id: audience.id,
        tags: audience.tags,
      };
      await updateAudience(upd_audience);
      return;
    })
  );

  return;
}

export async function getAudiencesListByFilter(
  filters: AudienceFilters,
  teamId: string
): Promise<{ data: Audience[]; absoluteCount: number }> {
  const result = await getAudiencesFromOpensearch(
    filters,
    0,
    OS_MAX_PAGINATION_LIMIT + 1, // To get all the records
    [],
    teamId
  );

  return {
    data: result.data,
    absoluteCount: result.absoluteCount,
  };
}

export async function deleteAudienceData(
  audIdList: string[]
): Promise<Boolean> {
  const resO = await batchDeleteItems(await TableNames.audiences(), audIdList);
  if (resO?.error) {
    console.error(resO?.error);
    return false;
  }
  return true;
}
