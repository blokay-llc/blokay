import AWS from "aws-sdk";

const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
});

export const uploadFile = function (
  name: string,
  buffer: Buffer | Uint8Array | Blob | string
) {
  return new Promise((resolve, reject) => {
    s3bucket.upload(
      {
        Bucket: process.env.AWS_BUCKET || "",
        Key: "blokay/" + name,
        Body: buffer,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data.Key);
      }
    );
  });
};

export const createBucket = function (name: string) {
  AWS.config.update({ region: "REGION" });

  let bucketParams = {
    Bucket: name,
  };
  s3bucket.createBucket(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Location);
    }
  });
};
