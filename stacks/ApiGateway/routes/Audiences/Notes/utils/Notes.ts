import { Note } from "./Notes.types";
import { TableNames } from "../../../../../../shared/utils/TableNames";
import { DB } from "../../../../../../shared/utils/DB";
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function createNote(note: Note) {
  await DB.write(await TableNames.notes(), note);
  return {
    id: note.id,
  };
}

export async function getNotesByAudienceIdAndTeam(
  aud_id: string,
  team_id: string
): Promise<Array<Note>> {
  const results = await new DynamoDBClient().send(
    new QueryCommand({
      TableName: await TableNames.notes(),
      IndexName: "audience_id",
      KeyConditionExpression: "audience_id = :audience_id",
      ExpressionAttributeValues: {
        ":audience_id": {
          S: aud_id,
        },
      },
    })
  );

  if (!results.Items) {
    return [];
  }
  const fnotes = results.Items.filter(
    (ele) => unmarshall(ele).team_id === team_id
  );

  if (fnotes.length == 0) return [];

  return fnotes.map((i: any) => {
    const val = unmarshall(i);
    return { id: val.id, timestamp: val.timestamp };
  });
}

export async function getNotesById(note_id: string): Promise<Note | undefined> {
  const result = await new DynamoDBClient().send(
    new GetItemCommand({
      TableName: await TableNames.notes(),
      Key: {
        id: {
          S: note_id,
        },
      },
    })
  );
  if (!result.Item) {
    return undefined;
  }
  return unmarshall(result.Item);
}

export async function updateNote(note_id: string, note_content: string) {
  await new DynamoDBClient().send(
    new UpdateItemCommand({
      TableName: await TableNames.notes(),
      Key: {
        id: {
          S: note_id,
        },
      },
      UpdateExpression: "SET note_content =:note_content",
      ExpressionAttributeValues: {
        ":note_content": {
          S: note_content,
        },
      },
    })
  );
}

export async function deleteNote(note_id: string) {
  await new DynamoDBClient().send(
    new DeleteItemCommand({
      TableName: await TableNames.notes(),
      Key: {
        id: {
          S: note_id,
        },
      },
    })
  );
}
