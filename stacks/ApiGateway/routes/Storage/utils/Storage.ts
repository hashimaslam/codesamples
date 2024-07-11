import { S3, SSM } from "aws-sdk";
import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  ListObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { getLogger } from "../../../../../shared/utils/middlewares/getLogger";

const URL_EXPIRATION_SECONDS = 300;
const s3 = new S3({
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
});
const s3Client = new S3Client({});

export const getTmpStorageBucketName = async () => {
  const Name = `/nft-governor/${process.env.AWS_ENV}/storage/Temporary-Files`;
  const param = await new SSM()
    .getParameter({
      Name,
      WithDecryption: true,
    })
    .promise();
  if (!param.Parameter?.Value) {
    throw new Error(
      `Can not find reference to temporary files S3 bucket in SSM parameter store: `
    );
  }
  return param.Parameter.Value;
};

export async function getBucketNameForUserFiles() {
  const Name = `/nft-governor/${process.env.AWS_ENV}/storage/User-Files`;
  const param = await new SSM()
    .getParameter({
      Name,
      WithDecryption: true,
    })
    .promise();
  if (!param.Parameter?.Value) {
    throw new Error(
      `Can't find reference to user files S3 bucket in SSM parameter store`
    );
  }
  return param.Parameter.Value;
}

export async function getBucketNameForTokenThumbnails() {
  const Name = `/nft-governor/${process.env.AWS_ENV}/storage/token-thumbnails`;
  const param = await new SSM()
    .getParameter({
      Name,
      WithDecryption: true,
    })
    .promise();
  if (!param.Parameter?.Value) {
    throw new Error(
      `Can't find reference to token thumbnail files S3 bucket in SSM parameter store`
    );
  }
  return param.Parameter.Value;
}

export async function copyBetweenBuckets(props: {
  sourceBucket: string;
  sourceKey: string;
  targetBucket: string;
  targetKey?: string;
}) {
  const s3 = new S3();
  try {
    const copyResult = await s3
      .copyObject({
        Bucket: props.targetBucket,
        CopySource: `${props.sourceBucket}/${props.sourceKey}`,
        Key: props.targetKey ?? props.sourceKey,
      })
      .promise();

    return !!copyResult.CopyObjectResult?.LastModified;
  } catch (e: any) {
    if (e.toString().includes("Access Denied")) {
      // The standard S3 error message when the Lambda lacks IAM permissions is not very helpful,
      // so we log a more helpful message here to helps dev save time when figuring out how to solve this.
      getLogger().error(
        `Access Denied to copy file from ${props.sourceBucket}/${props.sourceKey} to ${props.targetBucket}/${props.targetKey}. Check if the Lambda has S3 permissions in its IAM role or policy.`
      );
      throw new Error(
        "Access Denied - can not copy file between buckets because of missing permissions"
      );
    }
    throw e;
  }
}

export async function deleteObjectFromBucket(props: {
  targetBucket: string;
  targetKey: string;
}) {
  const s3 = new S3();
  const deleteResult = await s3
    .deleteObject({
      Bucket: props.targetBucket,
      Key: props.targetKey,
    })
    .promise();

  return !!deleteResult.DeleteMarker;
}

export async function deleteFolder(
  key: string,
  bucketName: string
): Promise<void> {
  const DeletePromises: Promise<DeleteObjectCommandOutput>[] = [];
  const { Contents } = await s3Client.send(
    new ListObjectsCommand({
      Bucket: bucketName,
      Prefix: key,
    })
  );
  if (!Contents) return;
  Contents.forEach(({ Key }) => {
    DeletePromises.push(
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key,
        })
      )
    );
  });

  await Promise.all(DeletePromises);
}

const storeFile = async (
  sourcePath: string,
  targetPath: string,
  publicFile: boolean
) => {
  const tmpBucket = await getTmpStorageBucketName();
  const userFilesBucket = publicFile
    ? await getBucketNameForTokenThumbnails()
    : await getBucketNameForUserFiles();
  await copyBetweenBuckets({
    sourceBucket: tmpBucket,
    sourceKey: sourcePath,
    targetBucket: userFilesBucket,
    targetKey: targetPath,
  });
};

const cloneFile = async (
  sourcePath: string,
  targetPath: string,
  publicFile: boolean
) => {
  const userFilesBucket = publicFile
    ? await getBucketNameForTokenThumbnails()
    : await getBucketNameForUserFiles();
  await copyBetweenBuckets({
    sourceBucket: userFilesBucket,
    sourceKey: sourcePath,
    targetBucket: userFilesBucket,
    targetKey: targetPath,
  });
};

const deleteFile = async (targetPath: string, publicFile: boolean) => {
  const userFilesBucket = (await publicFile)
    ? await getBucketNameForTokenThumbnails()
    : await getBucketNameForUserFiles();
  await deleteObjectFromBucket({
    targetBucket: userFilesBucket,
    targetKey: targetPath,
  });
};

export const storePrivateFile = async (
  sourcePath: string,
  targetPath: string
) => {
  await storeFile(sourcePath, targetPath, false);
};

export const storePublicFile = async (
  sourcePath: string,
  targetPath: string
) => {
  await storeFile(sourcePath, targetPath, true);
};

export const clonePrivateFile = async (
  sourcePath: string,
  targetPath: string
) => {
  await cloneFile(sourcePath, targetPath, false);
};

export const clonePublicFile = async (
  sourcePath: string,
  targetPath: string
) => {
  await cloneFile(sourcePath, targetPath, true);
};

export const deletePublicFile = async (targetPath: string) => {
  await deleteFile(targetPath, true);
};

export const deletePrivateFile = async (targetPath: string) => {
  await deleteFile(targetPath, false);
};

export const getPresigned = async (props: {
  filename: string;
  filetypewild: string;
}) => {
  const randomID = uuid();

  // @TODO parameterize file name and/or extension
  const path = `tmp/${randomID}/${props.filename}`;
  const Key = path;
  const Bucket = await getTmpStorageBucketName();

  // Get signed URL from S3
  const s3Params = {
    Bucket,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: props.filetypewild, //"image/*"
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
  const downloadUrl = s3.getSignedUrl("getObject", {
    Bucket,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
  });
  return {
    uploadUrl,
    downloadUrl,
    path,
  };
};

export const getPublicFixedURL = async (path: string) => {
  const Name = `/nft-governor/${process.env.AWS_ENV}/distributions/token-thumbnails/domain`;
  const param = await new SSM()
    .getParameter({
      Name,
    })
    .promise();
  if (!param.Parameter?.Value) {
    throw new Error(
      `Can't find reference to token-thumbnails files S3 bucket in SSM parameter store: `
    );
  }
  return `https://${param.Parameter.Value}/${path}`;
};

export const getSigned = async (path: string) => {
  const userFilesBucket = await getBucketNameForUserFiles();
  return s3.getSignedUrl("getObject", {
    Bucket: userFilesBucket,
    Key: path,
    Expires: 300,
  });
};

export const getSignedUrlForDownload = async (params: {
  bucket: string;
  key: string;
  expires?: number;
}) => {
  return s3.getSignedUrl("getObject", {
    Bucket: params.bucket,
    Key: params.key,
    Expires: params.expires ?? 300,
  });
};

export const uploadFile = async (params: S3.Types.PutObjectRequest) =>
  await s3.upload(params).promise();

export const getFileStream = async (path: string) => {
  const userFilesBucket = await getBucketNameForUserFiles();
  const bucketParams = {
    Bucket: userFilesBucket,
    Key: path,
  };
  return await s3Client.send(new GetObjectCommand(bucketParams));
};

export const getPresignedFileStream = async (path: string) =>
  await s3Client.send(
    new GetObjectCommand({
      Bucket: await getTmpStorageBucketName(),
      Key: path,
    })
  );

export const tmpFileExists = async (filename: string) => {
  const tmpFilesBucket = await getTmpStorageBucketName();
  const params = {
    Bucket: tmpFilesBucket,
    Key: filename,
  };
  try {
    await s3.headObject(params).promise();
    return true;
  } catch (err) {
    // Handle the standard error thrown when the object does not exist
    if ((err as any).code === "NotFound") return false;

    // Rethrow all other errors (e.g. "Forbidden")
    throw err;
  }
};

export const createFolder = async (bucket: string, foldername: string) => {
  const params = {
    Bucket: bucket,
    Key: foldername,
  };
  try {
    await s3.putObject(params).promise();
    return true;
  } catch (err) {
    return false;
  }
};
