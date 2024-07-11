import { APIGatewayProxyEvent } from "aws-lambda";
import { OpenSearchClient } from "../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { OpenSearchIndexManager } from "../../../../../shared/utils/OpenSearch/OpenSearchIndexManager";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { getLogger } from "../../../../../shared/utils/middlewares/getLogger";
import {
  DECIMAL_PRECISION,
  FORM_STATUS,
  Form,
  FormFilters,
  FormModel,
  RequiredBalance,
  SECRET_KEY,
  VERIFY_URL,
} from "./Forms.types";
import { RangeFilters } from "../../Audiences/utils/Audiences.types";
import { convertRangeFilterToOpenSearchObject } from "../../Audiences/utils/Audiences";
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDB } from "aws-sdk";
import { storePrivateFile } from "../../Storage/utils/Storage";
import { Time } from "../../../../../shared/utils/DateTime";
import { Source, SOURCE_TYPE } from "../../Sources/utils/Sources.types";
import { CreateFormProps } from "../Post/Post.lambda";
import { v4 as uuid } from "uuid";
import { BigNumber, ethers } from "ethers";
import { createSources } from "../../Sources/utils/Sources";
import {
  checkContractType,
  fetchERCBalance,
  fetchNativeTokenBalance,
} from "../../../../../shared/utils/Web3";
import fetch from "node-fetch";

export async function storeFormInDB(
  props: CreateFormProps,
  idUser: string,
  idTeam: string,
  status: FORM_STATUS
): Promise<{
  id: string;
  sourceId?: string;
  success: boolean;
  error?: string;
}> {
  const TABLE_NAME = await TableNames.forms();
  const id = uuid();
  const createdAt = Time.now();
  const updatedAt = createdAt;

  const item: Form = {
    // General information
    name: props.name,
    title: props.title,
    description: props.description,
    start: props.timeframe?.start ?? Time.now(), // Fallback to "now" if not provided
    end: props.timeframe?.end,
    cta_text: props.ctaText,
    scheduled_message: props.scheduledMessage,
    success_message: props.successMessage,
    max_member_size: props.maxMemberSize ?? 0,

    // Styling
    logo_path: await getLogoPath(id, props.styling?.logo),
    outer_background: props.styling?.outerBackground,
    outer_color: props.styling?.outerColor,
    inner_background: props.styling?.innerBackground,
    inner_color: props.styling?.innerColor,
    cta_background: props.styling?.ctaBackground,
    cta_color: props.styling?.ctaColor,
    requirements: props.requirements!,

    // Meta information
    id,
    id_user: idUser,
    id_team: idTeam,
    createdAt,
    updatedAt,
    status,

    // default all the below values to 0. These values will be populated eventually
    lastSubmission: 0,
    firstSubmission: 0,
    totalSubmissions: 0,
  };

  const client = new DynamoDBClient({});
  await client.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item, {
        removeUndefinedValues: true,
      }),
    })
  );

  // If the form status is published, create the source as well
  if (status === FORM_STATUS.PUBLISHED) {
    // If the form is published, let's check the contract requirements
    const check = await verifyContractType(
      item.requirements?.minRequiredBalances ?? [],
      item.id_team!
    );

    if (!check.success) {
      return { id, success: check.success, error: check.error };
    }
    const source: Source = {
      id: uuid(),
      team_id: idTeam,
      address: ethers.constants.AddressZero,
      source_name: props.name,
      type: SOURCE_TYPE.FORM,
      createdAt: Time.now(),
    };

    await createSources(source);

    await updateFormSingleField(item.id!, "source_id", source.id!);

    return { id, sourceId: source.id, success: true };
  }

  return { id, success: true };
}

export async function getFormsFromOpensearch(
  from: number,
  size: number,
  teamId: string,
  searchText: string,
  filters: FormFilters,
  sortBy: string[]
): Promise<{
  data: Form[];
  absoluteCount: number;
  aggregations: any;
}> {
  const index = (await TableNames.forms()).toLowerCase();
  await OpenSearchIndexManager.createIndexIfNeeded(index);

  let body: any = {
    sort: [],
    from,
    query: {
      bool: {
        must: [{ match_all: {} }],
      },
    },
    track_total_hits: true,
    aggs: {},
  };

  if (size && size > 0) {
    body.size = size;
  }

  if (teamId && teamId.length > 0) {
    body.query.bool["filter"] = [
      {
        term: {
          "id_team.keyword": teamId,
        },
      },
    ];
  }

  if (filters.sourceId && filters.sourceId.length > 0) {
    body.query.bool["filter"].push({
      term: {
        "source_id.keyword": filters.sourceId,
      },
    });
  }

  if (searchText && searchText.length > 0) {
    body.query.bool.must.push({
      bool: {
        should: [
          {
            query_string: {
              query: `*${searchText.trim().toLowerCase()}*`,
              fields: ["name"],
            },
          },
        ],
      },
    });
  }

  if (sortBy && sortBy.length > 0) {
    const numberTypeFields = [
      "createdAt",
      "updatedAt",
      "totalSubmissions",
      "firstSubmission",
      "lastSubmission",
      "start",
      "end",
      "max_member_size",
    ];

    sortBy.forEach((row) => {
      const splitVals = row.split(".");
      const sortField = splitVals[0];
      const sortDirection = splitVals[1];

      const sortByName = sortField;
      const key =
        sortByName + (numberTypeFields.includes(sortField) ? "" : ".keyword");
      body.sort.push({
        [key]: {
          order: sortDirection,
        },
      });
    });
  }

  // Add the status filter for forms
  if (filters.status && filters.status.length > 0) {
    body.query.bool.must.push({
      bool: {
        should: filters.status.map((ele: string) => ({
          term: {
            "status.keyword": ele,
          },
        })),
      },
    });
  }

  body.aggs = getMinMaxForOpensearchQueryForForm();

  filters.rangeFilters?.forEach((rangeFilter) => {
    body.query.bool.must.push(
      convertRangeFilterToOpenSearchObject(rangeFilter)
    );
  });

  try {
    const os = await OpenSearchClient.getInstance();

    getLogger().debug(`GET ${index}/_search`, JSON.stringify(body));

    const result = await os.search({
      index,
      body,
    });

    return {
      data: result.body.hits.hits.map((x: any) => x._source),
      absoluteCount: result.body.hits.total.value,
      aggregations: result.body.aggregations,
    };
  } catch (err: any) {
    console.error(err);
    getLogger().error(err);
    return {
      data: [],
      absoluteCount: 0,
      aggregations: {},
    };
  }
}

export function getFormFiltersFromEvent(
  event: APIGatewayProxyEvent
): FormFilters {
  const rangeFilters: RangeFilters[] = [
    {
      from: Number(event.queryStringParameters?.totalSubmissionsMin),
      to: Number(event.queryStringParameters?.totalSubmissionsMax),
      fieldName: "totalSubmissions",
    },
    {
      from: Number(event.queryStringParameters?.firstSubmissionFrom),
      to: Number(event.queryStringParameters?.firstSubmissionTo),
      fieldName: "firstSubmission",
    },
    {
      from: Number(event.queryStringParameters?.lastSubmissionFrom),
      to: Number(event.queryStringParameters?.lastSubmissionTo),
      fieldName: "lastSubmission",
    },
    {
      from: Number(event.queryStringParameters?.createAtFrom),
      to: Number(event.queryStringParameters?.createdAtTo),
      fieldName: "createdAt",
    },
  ];

  return {
    status: event.multiValueQueryStringParameters?.status ?? [],
    rangeFilters: rangeFilters.filter((x) => x.from || x.to),
    sourceId: event.queryStringParameters?.sourceId,
  };
}

function getMinMaxForOpensearchQueryForForm() {
  const dummyForm: Form = {
    createdAt: 0,
    updatedAt: 0,
    totalSubmissions: 0,
    firstSubmission: 0,
    lastSubmission: 0,
    start: 0,
    end: 0,
    max_member_size: 0,
  };
  let obj: any = {};

  for (let key in dummyForm) {
    if (typeof dummyForm[key as FormModel] === "number") {
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

export async function getFormFromDynamoDB(id: string) {
  const item = await new DynamoDBClient({}).send(
    new GetItemCommand({
      TableName: await TableNames.forms(),
      Key: marshall({ id }),
    })
  );

  if (!item.Item) {
    return;
  }
  return unmarshall(item.Item) as Form;
}

export async function deleteForm(id: string) {
  const client = new DynamoDBClient({});
  await client.send(
    new DeleteItemCommand({
      TableName: await TableNames.forms(),
      Key: marshall({ id }),
    })
  );
}

export async function updateFormSingleField(
  id: string,
  field: string,
  value: string | number
) {
  await new DynamoDB()
    .updateItem({
      TableName: await TableNames.forms(),
      Key: DynamoDB.Converter.marshall({ id }),
      UpdateExpression: `SET #field = :value`,
      ExpressionAttributeNames: {
        "#field": field,
      },
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":value": value,
      }),
    })
    .promise();
}

export async function getLogoPath(
  idForm: string,
  logoRelativePathInTmpBucket?: string
) {
  if (!logoRelativePathInTmpBucket) {
    return undefined;
  }

  const [extension] = logoRelativePathInTmpBucket.split(".").slice(-1);
  const targetPath = `forms/${idForm}/form_logo_${Time.now()}.${extension}`;
  await storePrivateFile(logoRelativePathInTmpBucket, targetPath);
  return targetPath;
}

export async function isEmailPresent(email: string, teamId: string) {
  let body: any = {
    size: 1,
    query: {
      bool: {
        must: [{ match_all: {} }],
        filter: [
          {
            term: {
              "email.keyword": `${email}`,
            },
          },
          {
            term: {
              "team_id.keyword": `${teamId}`,
            },
          },
        ],
      },
    },
  };

  try {
    const os = await OpenSearchClient.getInstance();
    const index = (await TableNames.audiences()).toLowerCase();
    const result = await os.search({
      index,
      body,
    });

    getLogger().debug(`GET ${index}/_search`, JSON.stringify(body));

    const data = result.body.hits.hits.map((x: any) => x._source);

    return data.length > 0 ? true : false;
  } catch (err) {
    return false;
  }
}

export async function minBalanceRequirementChecks(
  minReqBal: RequiredBalance[],
  walletAddress: string,
  teamId: string
): Promise<{ success: boolean; errors: string[] }> {
  let finalCheck: { success: boolean; errors: string[] } = {
    success: false,
    errors: [],
  };

  for (const req of minReqBal) {
    // Check if its a native token balance
    if (
      !req.address ||
      req.address?.localeCompare(ethers.constants.AddressZero) === 0
    ) {
      const data = await fetchNativeTokenBalance(
        walletAddress,
        req.network,
        teamId
      );

      if (data.error.length > 0) {
        finalCheck.success = false;
        finalCheck.errors.push(data.error);
        break;
      }

      const normalizedBal: BigNumber = data.bal.div(
        BigNumber.from(10).pow(18 - DECIMAL_PRECISION)
      );

      if (
        normalizedBal.gte(
          BigNumber.from(
            ethers.utils.parseUnits(
              req.minRequired.toFixed(DECIMAL_PRECISION).toString(),
              DECIMAL_PRECISION
            )
          )
        )
      ) {
        finalCheck.success = true;
      } else {
        finalCheck.success = false;
        finalCheck.errors.push(`Insufficient Native balance`);
        break;
      }
    } else {
      // Now that we have checked for native token, lets fetch the token balance of ERC20/ERC721 for a wallet
      const data = await fetchERCBalance(
        walletAddress,
        req.address!,
        req.contractType!,
        req.network,
        teamId
      );

      if (data.error.length > 0) {
        finalCheck.success = false;
        finalCheck.errors.push(data.error);
        break;
      }

      let normalizedBal: BigNumber =
        data.decimals > 0
          ? data.bal.div(BigNumber.from(10).pow(data.decimals))
          : data.bal;

      normalizedBal = normalizedBal.mul(10 ** DECIMAL_PRECISION);

      if (
        normalizedBal.gte(
          BigNumber.from(
            ethers.utils.parseUnits(
              req.minRequired.toFixed(DECIMAL_PRECISION).toString(),
              DECIMAL_PRECISION
            )
          )
        )
      ) {
        finalCheck.success = true;
      } else {
        finalCheck.success = false;
        finalCheck.errors.push(
          `Insufficient ERC token balance for ${req.address}`
        );
        break;
      }
    }
  }

  return finalCheck;
}

export async function verifyWithGoogleAPI(
  value: string
): Promise<{ success: boolean; error: string[] }> {
  // Validate Human
  const isHuman = await Promise.all([
    await fetch(`${VERIFY_URL}`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: `secret=${SECRET_KEY}&response=${value}`,
    })
      .then(async (res: any) => {
        const val = await res.json();
        return {
          success: val.success,
          error: [val["error-codes"]],
        };
      })
      .catch((err) => {
        return {
          success: false,
          error: [`Error in Google Siteverify API. ${err.message}`],
        };
      }),
  ]);

  if (isHuman && !isHuman[0].success) {
    isHuman[0].error.push("Not a human!");
    return { success: false, error: isHuman[0].error };
  }

  return { success: true, error: [""] };
}

export async function verifyContractType(
  reqFields: RequiredBalance[],
  teamId: string
): Promise<{ success: boolean; error: string }> {
  let finalCheck: {
    success: boolean;
    error: string;
  } = {
    success: false,
    error: "",
  };
  if (!reqFields || reqFields.length === 0) {
    finalCheck.success = true;
    return finalCheck;
  }

  for (const req of reqFields) {
    // Check if the contract type is valid
    // For ERC20, check for the decimals function
    // For ERC721, check for ownerOf function
    // For ERC1155, check for balanceOfBatch function
    if (
      !req.address ||
      req.address?.localeCompare(ethers.constants.AddressZero) === 0
    ) {
      // this is a native token case, skip this.
      finalCheck.success = true;
      continue;
    } else {
      // this is an ERC token case
      if (!req.contractType) {
        // this is a case where contract type is not provided but the address is present
        finalCheck.success = false;
        break;
      } else {
        const check = await checkContractType(
          req.address!,
          req.contractType,
          req.network,
          teamId
        );

        finalCheck.success = check.success;
        finalCheck.error = check.error;

        if (!finalCheck.success) break;
      }
    }
  }
  return finalCheck;
}

export async function updateFormInDb(id: string, attributes: Object) {
  await new DynamoDBClient().send(
    new PutItemCommand({
      TableName: await TableNames.forms(),
      Item: marshall(
        {
          ...attributes,
          id,
        },
        { removeUndefinedValues: true }
      ),
    })
  );
}
