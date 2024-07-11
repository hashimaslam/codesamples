import * as fs from "fs";
import imageType from "image-type";

export async function isImage(path: string) {
  const buffer = fs.readFileSync(path);
  const type = await imageType(buffer);
  return type?.mime.startsWith("image/"); // e.g. image/jpeg
}
