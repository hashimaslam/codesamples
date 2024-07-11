import { Extract } from "unzipper";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as tmp from "tmp";
import * as fs from "fs";

const s3Client = new S3Client({});

export const unzipS3ArchiveToLocalDir = async (props: {
  // Source S3 bucket where the ZIP file is located
  sourceBucket: string;
  // Source S3 key where the ZIP file is located
  sourceKey: string;
  // Local filesystem folder where the ZIP file should be extracted to
  localPath: string;
}) => {
  const command = await s3Client.send(
    new GetObjectCommand({
      Bucket: props.sourceBucket,
      Key: props.sourceKey,
    })
  );

  if (!command.Body) {
    throw new Error(
      `No body found in ${props.sourceBucket}/${props.sourceKey}`
    );
  }

  // Download the S3 file to a local /tmp file first
  const tmpFile = tmp.fileSync({ prefix: "unzipper-", postfix: ".zip" });
  await fs.promises.writeFile(tmpFile.name, command.Body);

  return new Promise<void>((resolve, reject) => {
    const start = Date.now();

    // Unzip the /tmp file to another /tmp directory
    fs.createReadStream(tmpFile.name)
      .pipe(
        Extract({
          path: props.localPath,
          forceStream: true,
          concurrency: 5,
        })
      )
      .on("error", reject)
      .on("close", () => {
        console.log(
          `Finished unzipping ${props.sourceBucket}/${
            props.sourceKey
          } to local dir ${props.localPath} in ${Date.now() - start}ms`
        );

        try {
          fs.unlinkSync(tmpFile.name); // cleanup
        } catch (e) {}

        resolve();
      });
  });
};
