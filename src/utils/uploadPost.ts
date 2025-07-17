import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import "dotenv/config";
export const putImage = async (
  data: any,
  foldername: string,
  filename: string,
  type: string
) => {
  const s3client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: `${process.env["AWS_ACCESSKEY"]}`,
      secretAccessKey: `${process.env["AWS_SECRET_ACCESSKEY"]}`,
    },
  });

  const listCommand = new ListObjectsV2Command({
    Bucket: `${process.env["BUCKET_NAME"]}`,
    Prefix: `${foldername}/`,
    MaxKeys: 1,
  });

  const extension = filename.split(".").pop()?.toLowerCase();
  let contentType;

  switch (extension) {
    // Image types
    case "jpg":
    case "jpeg":
      contentType = "image/jpeg";
      break;
    case "png":
      contentType = "image/png";
      break;
    case "gif":
      contentType = "image/gif";
      break;
    case "webp":
      contentType = "image/webp";
      break;
    case "bmp":
      contentType = "image/bmp";
      break;
    // Video types
    case "mp4":
      contentType = "video/mp4";
      break;
    case "mov":
      contentType = "video/quicktime";
      break;
    case "avi":
      contentType = "video/x-msvideo";
      break;
    case "wmv":
      contentType = "video/x-ms-wmv";
      break;
    case "flv":
      contentType = "video/x-flv";
      break;
    case "webm":
      contentType = "video/webm";
      break;
    default:
      contentType = "application/octet-stream"; // fallback for unknown types
  }

  await s3client.send(listCommand);

  const mediaBuffer = Buffer.from(data, "base64");

  try {
    if (type == "STORY") {
      const uploadCommand = new PutObjectCommand({
        Bucket: `${process.env["BUCKET_NAME"]}`,
        Key: `${foldername}/story/${filename}`,
        Body: mediaBuffer,
        ContentType: contentType,
        ContentDisposition: "inline",
      });
      await s3client.send(uploadCommand);
      return `${process.env["BUCKET_PATH"]}${foldername}/story/${filename}`;
    } else {
      const uploadCommand = new PutObjectCommand({
        Bucket: `${process.env["BUCKET_NAME"]}`,
        Key: `${foldername}/${filename}`,
        Body: mediaBuffer,
        ContentType: contentType,
        ContentDisposition: "inline",
      });
      await s3client.send(uploadCommand);
      return `${process.env["BUCKET_PATH"]}${foldername}/${filename}`;
    }


  } catch (err) {
    console.error("Error uploading media:", err);
    throw err;
  }
};
