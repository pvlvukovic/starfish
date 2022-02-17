// upload file to s3

// imports
const aws = require("aws-sdk");
const dotenv = require("dotenv");

// configure local environment variables
dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// upload file to s3
module.exports = (file) => {
  // create file name
  const fileName = `${Date.now()}-${file.originalname}`;

  // get file buffer and turn into binary
  const fileBuffer = Buffer.from(file.buffer);

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
};
