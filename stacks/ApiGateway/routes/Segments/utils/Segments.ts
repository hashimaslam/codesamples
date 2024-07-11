import { DynamoDB } from "aws-sdk";
import {
  FilterType,
  Segment,
  SegmentFilters,
  SegmentMember,
} from "./Segments.types";
import { TableNames } from "../../../../../shared/utils/TableNames";
import {
  constructFiltersObject,
  getAudiencesFromOpensearch,
} from "../../Audiences/utils/Audiences";
import { Audience } from "../../Audiences/utils/Audiences.types";
import { OpenSearchClient } from "../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { OpenSearchIndexManager } from "../../../../../shared/utils/OpenSearch/OpenSearchIndexManager";
import { DEFAULT_PAGINATION } from "../../../../../shared/utils/Pagination";
import { batchDeleteItems } from "../../../../../shared/utils/DynamoDB";
import { DB } from "../../../../../shared/utils/DB";

export async function getSegmentsByTeamId(teamId?: string): Promise<Segment[]> {
  let totalResults: DynamoDB.ItemList = [];
  let results;
  let params: any;
  let lastEvaluatedKey = undefined;
  do {
    params = {
      TableName: await TableNames.segments(),
      ExclusiveStartKey: lastEvaluatedKey,
    };

    if (teamId) {
      params.IndexName = "team_id";
      params.KeyConditionExpression = "team_id = :team_id";
      params.ExpressionAttributeValues = {
        ":team_id": {
          S: teamId,
        },
      };
      results = await new DynamoDB().query(params).promise();
    } else {
      results = await new DynamoDB().scan(params).promise();
    }

    if (results.Items) {
      totalResults = totalResults.concat(results.Items);
    }
    lastEvaluatedKey = results.LastEvaluatedKey;
  } while (!!results.LastEvaluatedKey && !!!params.Limit);
  return totalResults.map((x: any) =>
    DynamoDB.Converter.unmarshall(x)
  ) as Segment[];
}

export async function getSegmentById(id: string): Promise<Segment | undefined> {
  const result = await new DynamoDB()
    .getItem({
      TableName: await TableNames.segments(),
      Key: DynamoDB.Converter.marshall({
        id: id,
      }),
    })
    .promise();

  if (!result.Item) {
    return undefined;
  }
  return DynamoDB.Converter.unmarshall(result.Item) as Segment;
}

export async function getSegmentMembers(
  segmentId?: string
): Promise<SegmentMember[]> {
  let totalResults: DynamoDB.ItemList = [];
  let results;
  let params: any;
  let lastEvaluatedKey = undefined;
  do {
    params = {
      TableName: await TableNames.segmentMembers(),
      ExclusiveStartKey: lastEvaluatedKey,
    };

    if (segmentId) {
      params.IndexName = "segment_id";
      params.KeyConditionExpression = "segment_id = :segment_id";
      params.ExpressionAttributeValues = {
        ":segment_id": {
          S: segmentId,
        },
      };
      results = await new DynamoDB().query(params).promise();
    } else {
      results = await new DynamoDB().scan(params).promise();
    }

    if (results.Items) {
      totalResults = totalResults.concat(results.Items);
    }
    lastEvaluatedKey = results.LastEvaluatedKey;
  } while (!!results.LastEvaluatedKey && !!!params.Limit);
  return totalResults.map((x: any) =>
    DynamoDB.Converter.unmarshall(x)
  ) as SegmentMember[];
}

export async function getSegmentMembersByAudienceId(
  audienceId: string
): Promise<SegmentMember[]> {
  let totalResults: DynamoDB.ItemList = [];
  let results;
  let params: any;
  let lastEvaluatedKey = undefined;
  do {
    params = {
      TableName: await TableNames.segmentMembers(),
      ExclusiveStartKey: lastEvaluatedKey,
    };

    params.IndexName = "audience_id";
    params.KeyConditionExpression = "audience_id = :audience_id";
    params.ExpressionAttributeValues = {
      ":audience_id": {
        S: audienceId,
      },
    };
    results = await new DynamoDB().query(params).promise();

    if (results.Items) {
      totalResults = totalResults.concat(results.Items);
    }
    lastEvaluatedKey = results.LastEvaluatedKey;
  } while (!!results.LastEvaluatedKey && !!!params.Limit);
  return totalResults.map((x: any) =>
    DynamoDB.Converter.unmarshall(x)
  ) as SegmentMember[];
}

export async function createSegment(segment: Segment) {
  await DB.write(await TableNames.segments(), segment);
  return {
    id: segment.id,
  };
}

export async function updateSegment(segment: any) {
  let updateExpression = "set";
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};
  for (const property in segment as Segment) {
    if (property === "id") continue;
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = segment[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.segments(),
      Key: DynamoDB.Converter.marshall({
        id: segment.id,
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
    id: segment.id,
    updated_attributes: result.Attributes
      ? DynamoDB.Converter.unmarshall(result.Attributes)
      : {},
  };
}

export async function updateSegmentSingleField(
  id: string,
  field: string,
  value: string | string[]
) {
  let body = {
    TableName: await TableNames.segments(),
    Key: DynamoDB.Converter.marshall({ id }),
    UpdateExpression: `SET #field = :value`,
    ExpressionAttributeNames: {
      "#field": field,
    },
    ExpressionAttributeValues: {},
  };
  if (field.localeCompare("filters") === 0) {
    body.ExpressionAttributeValues = DynamoDB.Converter.marshall({
      ":value": JSON.parse(JSON.stringify(value)),
    });
  } else {
    body.ExpressionAttributeValues = DynamoDB.Converter.marshall({
      ":value": value,
    });
  }

  await new DynamoDB().updateItem(body).promise();
}

export async function deleteSegmentMembers(id: string): Promise<Boolean> {
  const segmentMembers: SegmentMember[] = await getSegmentMembers(id);
  const segMemIds = segmentMembers.map((sgm) => sgm.id);
  const resO = await batchDeleteItems(
    await TableNames.segmentMembers(),
    segMemIds
  );
  if (resO?.error) {
    console.error(resO?.error);
    return false;
  }
  return true;
}

export async function deleteSegment(id: string): Promise<Boolean> {
  const item = await new DynamoDB()
    .deleteItem({
      TableName: await TableNames.segments(),
      Key: DynamoDB.Converter.marshall({ id }),
    })
    .promise();
  if (item.$response.error) {
    console.error(item.$response.error);
    return false;
  }
  return true;
}

export async function isUniqueName(
  name: string,
  team_id: string
): Promise<boolean> {
  const segList = await getSegmentsByTeamId(team_id);

  const filterdList = segList.filter(
    (row) =>
      row.name
        ?.toLowerCase()
        .trim()
        .localeCompare(name.toLowerCase().trim()) === 0
  );

  return filterdList.length <= 0;
}

export async function fetchData(
  segment: Segment,
  apiFilters: FilterType,
  offset?: number,
  limit?: number
): Promise<{
  data: Audience[];
  absoluteCount: number;
  aggregations: any;
}> {
  let mergedFilters: FilterType = apiFilters;

  // concat the filters from segment and input given
  if (segment.filters) {
    if (segment.filters.sort) {
      mergedFilters.sort = Array.from(
        new Set(
          segment.filters.sort.concat(
            mergedFilters.sort ? mergedFilters.sort : []
          )
        )
      );
    }

    if (segment.filters.sourceId) {
      mergedFilters.sourceId = Array.from(
        new Set(
          segment.filters.sourceId.concat(
            mergedFilters.sourceId ? mergedFilters.sourceId : []
          )
        )
      );
    }

    if (segment.filters.tags) {
      mergedFilters.tags = Array.from(
        new Set(
          segment.filters.tags.concat(
            mergedFilters.tags ? mergedFilters.tags : []
          )
        )
      );
    }

    if (segment.filters.type) {
      mergedFilters.type = Array.from(
        new Set(
          segment.filters.type.concat(
            mergedFilters.type ? mergedFilters.type : []
          )
        )
      );
    }

    if (!mergedFilters.searchText) {
      mergedFilters.searchText = segment.filters.searchText;
    }

    if (segment.filters.totalCount) {
      if (!mergedFilters.totalCount)
        mergedFilters.totalCount = segment.filters.totalCount;
      else if (segment.filters.totalCount > mergedFilters.totalCount) {
        mergedFilters.totalCount = segment.filters.totalCount;
      }
    }
  }

  return await getAudiencesFromOpensearch(
    {
      sourceId: mergedFilters.sourceId ?? [],
      type: mergedFilters.type,
      tags: mergedFilters.tags,
      searchText: mergedFilters.searchText,
    },
    offset ? offset : 0,
    limit ? limit : Number(mergedFilters.totalCount),
    mergedFilters.sort as string[],
    segment.team_id as string
  );
}

export async function getSegmentsDataFromOpensearch(
  teamId: string,
  searchText: string | undefined,
  sortParams: [string] | undefined,
  filters: SegmentFilters | undefined
): Promise<{ data: Segment[]; absoluteCount: number }> {
  let body: any = {
    sort: [],
    size: filters?.totalCount ? filters.totalCount : DEFAULT_PAGINATION,
    query: {
      bool: {
        must: [{ match_all: {} }],
      },
    },
    track_total_hits: true,
  };

  // add team id filter
  body.query.bool["filter"] = [
    {
      term: {
        "team_id.keyword": teamId,
      },
    },
  ];

  // add search context params
  if (searchText && searchText.length > 0) {
    if (!body.query.bool["filter"]) body.query.bool["filter"] = [];
    body.query.bool["filter"].push({
      query_string: {
        query: `*${searchText.trim().toLowerCase()}*`,
        fields: ["name"],
      },
    });
  }

  // add sort params(multiple sort params if applicable)
  if (sortParams) {
    const numberTypeFields = ["date_created"];
    sortParams.forEach((row) => {
      const splitVals = row.split(".");
      let key = splitVals[0];

      key =
        key + (numberTypeFields.indexOf(splitVals[0]) == -1 ? ".keyword" : "");

      body.sort.push({
        [key]: {
          order: splitVals[1],
        },
      });
    });
  }

  // add date range filters
  if (filters && filters.date) {
    const rangeObj = constructFiltersObject(filters.date);
    if (rangeObj && Object.keys(rangeObj).length > 0) {
      const len = body.query.bool.must.length;
      body.query.bool.must[len] = rangeObj;
    }
  }

  // add total members in a segment filter
  if (filters && filters.totalMembers) {
    const rangeObj = constructFiltersObject(filters.totalMembers);
    if (rangeObj && Object.keys(rangeObj).length > 0) {
      const len = body.query.bool.must.length;
      body.query.bool.must[len] = rangeObj;
    }
  }

  // add type filter
  if (filters && filters.type && filters.type.length > 0) {
    const len = body.query.bool.must.length;
    body.query.bool.must[len] = { bool: { should: [] } };

    // Populate match phrase for each item in the array of type(input)
    filters.type.forEach((data: string) => {
      body.query.bool.must[len].bool.should.push({
        term: {
          "type.keyword": data,
        },
      });
    });
  }

  // add status filter
  if (filters && filters.status && filters.status.length > 0) {
    const len = body.query.bool.must.length;
    body.query.bool.must[len] = { bool: { should: [] } };

    // Populate match phrase for each item in the array of status(input)
    filters.status.forEach((data: string) => {
      body.query.bool.must[len].bool.should.push({
        term: {
          "status.keyword": data,
        },
      });
    });
  }

  const os = await OpenSearchClient.getInstance();
  const index = (await TableNames.segments()).toLowerCase();

  console.debug(`GET ${index}/_search `, JSON.stringify(body /*, null, "\t"*/));

  await OpenSearchIndexManager.createIndexIfNeeded(index);
  const result = await os.search({
    index,
    body,
  });

  return {
    data: result.body.hits.hits.map((x: any) => x._source),
    absoluteCount: result.body.hits.total.value,
  };
}
