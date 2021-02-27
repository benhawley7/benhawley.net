import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3'
import * as s3Deploy from '@aws-cdk/aws-s3-deployment'
import * as cloudfront from '@aws-cdk/aws-cloudfront'

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 Bucket to store website content
    const bucket = new s3.Bucket(this, "BenHawleyNetBucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html"
    });

    // Upload website content to Bucket
    new s3Deploy.BucketDeployment(this, "UploadWebsite", {
      sources: [s3Deploy.Source.asset("../public")],
      destinationBucket: bucket
    });

    // Cloudfront
    new cloudfront.CloudFrontWebDistribution(this, "BenHawleyNetCDN", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket
          },
          behaviors: [{isDefaultBehavior: true}]
        },
      ],
      // BenHawley.net is a SPA app,  hence we need to return the index.html for 404 / 403s in S3
      errorConfigurations: [
        {
          errorCode: 404,
          responsePagePath: '/index.html',
          responseCode: 200
        },
        {
          errorCode: 403,
          responsePagePath: '/index.html',
          responseCode: 200
        }
      ]
    });
  }
}
