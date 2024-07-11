import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { S3Bucket } from "../shared/constructs/S3Bucket";

export class Storage extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new S3Bucket(this, "Temporary-Files", {
      lifecycleRules: [
        {
          // Auto GC all files in this bucket every 3 days
          expiration: Duration.days(3),
        },
      ],
      cors: [
        {
          // Generating and using Presigned URLs in the frontend requires CORS policies on the bucket
          allowedHeaders: ["*"],
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST],
          allowedOrigins: ["*"],
        },
      ],
    });

    new S3Bucket(this, "User-Files", {
      cors: [
        {
          // Generating and using Presigned URLs in the frontend requires CORS policies on the bucket
          allowedHeaders: ["*"],
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST],
          allowedOrigins: ["*"],
        },
      ],
    });

    const tokenThumbnailsBucket = new S3Bucket(this, "token-thumbnails", {
      accessControl: BucketAccessControl.PRIVATE,
      removalPolicy:
        process.env.AWS_ENV === "production"
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
    });
    tokenThumbnailsBucket.enableCloudFrontDistribution();
  }
}
