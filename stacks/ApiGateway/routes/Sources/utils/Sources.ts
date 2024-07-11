import { DynamoDB } from "aws-sdk";
import { COVALENTHQ_PAGE_SIZE, Source, SourceFilters } from "./Sources.types";
import { TableNames } from "../../../../../shared/utils/TableNames";
import {
  Audience,
  OS_MAX_PAGINATION_LIMIT,
} from "../../Audiences/utils/Audiences.types";
import {
  batchDeleteItems,
  putBatchItems,
} from "../../../../../shared/utils/DynamoDB";
import { getCovalentAPIKey } from "../../../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import { getErrorMessage } from "../../../../../shared/utils/Common";
import {
  deleteAudienceData,
  isAddressPresentForATeam,
  updateAudience,
} from "../../Audiences/utils/Audiences";
import {
  CHAIN_NAMES,
  COVALENTHQ_API_PATH,
} from "../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { v4 as uuid } from "uuid";
import fetch from "node-fetch";
import {
  SEGMENT_TYPE,
  SegmentMember,
} from "../../Segments/utils/Segments.types";
import {
  getSegmentMembers,
  getSegmentMembersByAudienceId,
  getSegmentsDataFromOpensearch,
  updateSegment,
} from "../../Segments/utils/Segments";
import { getNotesByAudienceIdAndTeam } from "../../Audiences/Notes/utils/Notes";
import { DB } from "../../../../../shared/utils/DB";
import { formatShortDate, Time } from "../../../../../shared/utils/DateTime";
import { OpenSearchIndexManager } from "../../../../../shared/utils/OpenSearch/OpenSearchIndexManager";
import { OpenSearchClient } from "../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { Note } from "../../Audiences/Notes/utils/Notes.types";
import { getCheckSumAddress } from "../../../../../shared/utils/Web3";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function createSources(sourcesData: Source) {
  await DB.write(await TableNames.sources(), sourcesData);
  return {
    id: sourcesData.id,
  };
}

export async function getSourceByAddress(
  address: string
): Promise<Array<Source>> {
  const result = await new DynamoDB()
    .query({
      TableName: await TableNames.sources(),
      IndexName: "address",
      KeyConditionExpression: "address = :address",
      ExpressionAttributeValues: {
        ":address": {
          S: address,
        },
      },
    })
    .promise();

  if (!result.Items) {
    return [];
  }

  return result.Items.map((x) => DynamoDB.Converter.unmarshall(x));
}

export async function getSourceById(id: string): Promise<Source | undefined> {
  const result = await new DynamoDB()
    .getItem({
      TableName: await TableNames.sources(),
      Key: DynamoDB.Converter.marshall({
        id: id,
      }),
    })
    .promise();

  if (!result.Item) {
    return undefined;
  }

  return DynamoDB.Converter.unmarshall(result.Item);
}

export async function getSourceByTeamId(team_id: string): Promise<Source[]> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.sources(),
      IndexName: "team_id",
      KeyConditionExpression: "team_id = :team_id",
      ExpressionAttributeValues: {
        ":team_id": {
          S: team_id,
        },
      },
    })
    .promise();

  if (!results.Items) return [];

  return results.Items.map((x) => DynamoDB.Converter.unmarshall(x));
}

export async function getAllSources(): Promise<Source[]> {
  const results = await new DynamoDBClient().send(
    new ScanCommand({
      TableName: await TableNames.sources(),
    })
  );

  if (!results.Items) return [];

  return results.Items.map((x) => unmarshall(x));
}

export async function fetchUniqueSourceList(
  team_id: string,
  source_name: string
): Promise<Source[]> {
  const sourceNameList = await getSourceByTeamId(team_id);

  return sourceNameList.filter((ele) => {
    return (
      ele.source_name
        ?.toLowerCase()
        .trim()
        ?.localeCompare(source_name.toLowerCase().trim()) == 0
    );
  });
}

export async function getSourceIdBySourceName(
  team_id: string,
  source_name: string
): Promise<string | undefined> {
  const sourceNameItem = await fetchUniqueSourceList(team_id, source_name);

  if (sourceNameItem.length > 0) return sourceNameItem[0].id;

  return undefined;
}

export async function isUniqueSourceName(
  team_id: string,
  source_name: string
): Promise<Boolean> {
  const sourceNameItem = await fetchUniqueSourceList(team_id, source_name);

  if (sourceNameItem.length > 0) return false;

  return true;
}

export async function updateSourceSingleField(
  id: string,
  field: string,
  value: string | string[] | number
) {
  let body = {
    TableName: await TableNames.sources(),
    Key: DynamoDB.Converter.marshall({ id }),
    UpdateExpression: `SET #field = :value`,
    ExpressionAttributeNames: {
      "#field": field,
    },
    ExpressionAttributeValues: DynamoDB.Converter.marshall({
      ":value": value,
    }),
  };

  await new DynamoDB().updateItem(body).promise();
}

export async function deleteSource(id: string): Promise<Boolean> {
  const item = await new DynamoDB()
    .deleteItem({
      TableName: await TableNames.sources(),
      Key: DynamoDB.Converter.marshall({ id }),
    })
    .promise();

  if (item.$response.error) {
    console.error(item.$response.error);
    return false;
  }
  return true;
}

export async function partiallyUpdateAudienceWithSourceIds(
  audDetails: Audience[],
  sourceId: string,
  sourceName: string,
  oldSourceName?: string,
  removeSource = false
) {
  const data = audDetails.map((aud) => {
    if (removeSource) {
      aud.source_ids = aud.source_ids?.filter((ele) => ele !== sourceId);
      aud.sources = aud.sources?.filter(
        (ele) => ele.localeCompare(sourceName) !== 0
      );
    } else {
      aud.sources = aud.sources?.map((ele) => {
        return ele.localeCompare(oldSourceName!) === 0 ? sourceName : ele;
      });
    }
    return aud;
  });

  const res = await putBatchItems(await TableNames.audiences(), data);
}

export async function fetchAudienceAddresses(
  contractAddress: string,
  chain_id: number,
  sourceName: string,
  sourceId: string,
  team_id: string
): Promise<{
  audList: string[];
  count: number;
  totalCount: number;
  errors: string[];
}> {
  const covalenthqApiKey = await getCovalentAPIKey();
  const errors: string[] = [];

  const headers = {
    Authorization: `Bearer ${covalenthqApiKey}`,
  };

  let audList: Audience[] = [];
  let retAudList: string[] = [];
  let noteList: Note[] = [];
  let page_number = 0;
  let count = 0;
  let totalCount = 0;

  try {
    do {
      const url = `${COVALENTHQ_API_PATH}/${CHAIN_NAMES[chain_id]}/tokens/${contractAddress}/token_holders_v2/?page-size=${COVALENTHQ_PAGE_SIZE}&page-number=${page_number}`;

      const [response] = await Promise.all([
        await fetch(url, {
          method: "GET",
          headers: headers,
        }),
      ])
        .then((results) =>
          Promise.all(
            results.map((r) => {
              return r?.json();
            })
          )
        )
        .then((ret) => {
          return [ret[0] as unknown as { data: any; error: boolean }];
        });

      if (response.data) {
        if (response.data.pagination.has_more) {
          page_number += 1;
        } else {
          page_number = -1;
          totalCount = response.data.pagination.total_count;
        }

        // populate the audience data
        await Promise.all(
          response.data.items.map(async (ele: any) => {
            const cAddress = getCheckSumAddress(ele.address);
            const auds = await isAddressPresentForATeam(cAddress, team_id);
            if (auds.length == 0) {
              count += 1;
              const aud: Audience = {
                id: uuid(),
                address: cAddress,
                team_id: team_id,
                sources: [sourceName],
                source_ids: [sourceId],
                usdBalance: 0,
                nfts: 0,
                type: "holder",
                tags: ["nft-holder"],
                createdAt: Time.now(),
              };
              audList.push(aud);
              retAudList.push(audList[audList.length - 1].id!);
              noteList.push({
                id: uuid(),
                team_id: team_id,
                note_content: `Added via Contract import on ${formatShortDate(
                  new Date()
                )}`,
                audience_id: aud.id,
                timestamp: Time.now(),
                updated_at: 0,
              });
            } else {
              retAudList.push(auds[0].id!);
              // append the source ids and source names, if not exist, to the existing audience member.
              const ids: string[] = auds[0].source_ids || [];
              if (!ids.find((s) => s === sourceId)) {
                ids.push(sourceId);
                const sourceNames: string[] = auds[0].sources || [];
                sourceNames.push(sourceName);
                auds[0].source_ids = ids;
                auds[0].sources = sourceNames;
                updateAudience(auds[0]);
              }
            }
          })
        )
          .then(async (x) => {
            // insert in the dynamodb of audience table
            if (audList.length > 0) {
              await putBatchItems(
                await TableNames.audiences(),
                audList.map((x) => {
                  x.usdBalance = x.usdBalance
                    ? Number(x.usdBalance.toFixed(2))
                    : 0;
                  return x;
                })
              );

              await putBatchItems(await TableNames.notes(), noteList);

              audList = [];
              noteList = [];
            }
          })
          .catch((x) => {
            const error = `Something went wrong: ${x}`;

            console.error(error);
            errors.push(error);
          });
      } else {
        const error = `Error at Covalent API (token_holders_v2) for address ${contractAddress}: ${JSON.stringify(
          response
        )}`;

        console.error(error);
        errors.push(error);
        break;
      }
    } while (page_number >= 0);

    return { audList: retAudList, count, totalCount, errors };
  } catch (err) {
    errors.push(`Something unexpected happened: ${getErrorMessage(err)}`);

    return { audList: retAudList, count, totalCount, errors };
  }
}

export async function cascadeDeleteSource(
  sourceId: string,
  sourceName: string,
  teamId: string,
  audList: Audience[]
): Promise<{ errors: string[] }> {
  let errors: string[] = [];
  try {
    const audDetailsWithOneSource: Audience[] = audList.filter((aud) => {
      return aud.source_ids && aud.source_ids.length == 1;
    });

    const audIds: string[] = audDetailsWithOneSource.map((aud) => aud.id!);

    // Delete the audience holdings and the notes for the audience
    audIds.forEach(async (ele) => {
      const notes: Note[] = await getNotesByAudienceIdAndTeam(ele, teamId);

      const noteIds: string[] = notes.map((ele) => ele.id!);

      await batchDeleteItems(await TableNames.notes(), noteIds);
      const segmentMembers: SegmentMember[] =
        await getSegmentMembersByAudienceId(ele);
      const segmembers_ids = segmentMembers.map((h) => h.id);
      await batchDeleteItems(await TableNames.segmentMembers(), segmembers_ids);
    });

    // Once audience holdings data is delete, delete the data in audiences list
    if (!(await deleteAudienceData(audIds))) {
      errors.push(`Unable to delete audience data for ${audIds}`);
    }

    // Now lets update the audience table which has more than 1 source to remove the current source id
    const audDetails: Audience[] = audList.filter((aud) => {
      return aud.source_ids && aud.source_ids.length > 1;
    });

    if (audDetails)
      await partiallyUpdateAudienceWithSourceIds(
        audDetails,
        sourceId,
        sourceName,
        "",
        true
      );

    // Now delete the audience ids from the segments as well
    const segData = await getSegmentsDataFromOpensearch(
      teamId,
      undefined,
      undefined,
      {
        type: [SEGMENT_TYPE.SNAPSHOT],
      }
    );

    await Promise.all([
      segData.data.forEach(async (ele) => {
        if ((ele.type = SEGMENT_TYPE.SNAPSHOT)) {
          const newTotal = (await getSegmentMembers(ele.id)).length;
          const isChanged = ele.totalMembers !== newTotal;
          if (isChanged) {
            ele.totalMembers = newTotal;
            ele.filters!.totalCount = newTotal;
            await updateSegment(ele);
          }
        }
      }),
    ]);

    return { errors };
  } catch (err) {
    errors.push(`Something unexpected happened: ${getErrorMessage(err)}`);

    return { errors };
  }
}

export async function getSourcesDataFromOpensearch(
  teamId?: string,
  searchText?: string,
  sortBy?: string[],
  filters?: SourceFilters
): Promise<{ data: Source[]; absoluteCount: number }> {
  let body: any = {
    sort: [],
    size: filters?.limit ?? OS_MAX_PAGINATION_LIMIT,
    from: filters?.offset ?? 0,
    query: {
      bool: {
        must: [{ match_all: {} }],
      },
    },
    track_total_hits: true,
  };

  if (teamId && teamId.length > 0) {
    // add team id filter
    body.query.bool["filter"] = [
      {
        term: {
          "team_id.keyword": teamId,
        },
      },
    ];
  }

  // add search context params
  if (searchText && searchText.length > 0) {
    body.query.bool.must.push({
      query_string: {
        query: `*${searchText.trim().toLowerCase()}*`,
        fields: ["source_name", "address"],
      },
    });
  }

  // add sort params(multiple sort params if applicable)
  if (sortBy) {
    const numberTypeFields = ["chain_id", "createdAt"];

    sortBy.forEach((row) => {
      const splitVals = row.split(".");

      const key =
        splitVals[0] +
        (numberTypeFields.indexOf(splitVals[0]) == -1 ? ".keyword" : "");

      body.sort.push({
        [key]: {
          order: splitVals[1],
        },
      });
    });
  }

  if (filters) {
    // add symbol filter
    if (filters.symbol && filters.symbol.length > 0) {
      const len = body.query.bool.must.length;
      body.query.bool.must[len] = { bool: { should: [] } };

      // Populate match phrase for each item in the array of symbol(input)
      filters.symbol.forEach((data) => {
        body.query.bool.must[len].bool.should.push({
          term: {
            "symbol.keyword": data,
          },
        });
      });
    }

    // add type filter
    if (filters.type && filters.type.length > 0) {
      const len = body.query.bool.must.length;
      body.query.bool.must[len] = { bool: { should: [] } };

      // Populate match phrase for each item in the array of type(input)
      filters.type.forEach((data) => {
        body.query.bool.must[len].bool.should.push({
          term: {
            "type.keyword": data,
          },
        });
      });
    }

    // add chain id filter
    if (filters.chainId && filters.chainId.length > 0) {
      const len = body.query.bool.must.length;
      body.query.bool.must[len] = { bool: { should: [] } };

      // Populate match phrase for each item in the array of chain id(input)
      filters.chainId.forEach((data) => {
        body.query.bool.must[len].bool.should.push({
          term: {
            chain_id: Number(data),
          },
        });
      });
    }
  }

  const os = await OpenSearchClient.getInstance();
  const index = (await TableNames.sources()).toLowerCase();

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
