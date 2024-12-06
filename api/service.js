const cloudinary = require("cloudinary").v2;
const { GridFSBucket } = require("mongodb");
const { PassThrough } = require("stream");
const { getDatabase } = require("./models/database");

const {
  UPLOAD_BUCKET_NAME,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./helpers/constants");

const config_cloudinary = () =>
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

const create_mongodb_bucket = () => {
  const database = getDatabase();
  return new GridFSBucket(database, { bucketName: UPLOAD_BUCKET_NAME });
};

function init_service() {
  const cloudinary_instance = config_cloudinary();
  const bucket = create_mongodb_bucket();
  return { cloudinary_instance, bucket };
}

function handle_stream(cloudinary_instance, video_from_mongodb) {
  return new Promise((resolve, reject) => {
    let part = cloudinary_instance.uploader.upload_stream(
      { resource_type: "video" },
      (err, result) => {
        if (err) {
          console.error("error upload: ", err);
          reject({ error: err });
        } else {
          resolve({ response: result });
        }
      }
    );

    video_from_mongodb.pipe(part);

    video_from_mongodb.on("error", (err) => {
      console.error("Error reading bucket:", err);
      reject({ error: result });
    });
  });
}

function combine_videos(bucket, videos_from_mongodb, stream) {
  return new Promise((resolve, reject) => {
    const stream_next = (index) => {
      if (index >= videos_from_mongodb.length) {
        stream.end();
        resolve({ response: "success" });
      }

      //Explanation: Le signature est un signature token jwt, qui fait reference à un video, contient son nom d'origine une fois décoder
      if (videos_from_mongodb[index]);
      {
        const { signature } = videos_from_mongodb[index];
        const video_from_mongodb = bucket.openDownloadStreamByName(signature);

        video_from_mongodb.on("data", (chunk) => {
          stream.write(chunk);
        });

        video_from_mongodb.on("end", () => {
          stream_next(index + 1);
        });

        video_from_mongodb.on("error", (err) => {
          reject(err);
        });
      }
    };
    const INIT = 0;
    stream_next(INIT);
  });
}

async function upload_to_cloudinary(videos) {
  // declare bucket
  const { cloudinary_instance, bucket } = init_service();

  const stream = new PassThrough(); // Stream qui contiendra toutes les vidéos concaténées

  //Fonctionnality: Lire en streaming la video dans le bucket et l'écrire dans cloudinary
  await combine_videos(bucket, videos, stream);
  return await handle_stream(cloudinary_instance, stream);
}

module.exports = { upload_to_cloudinary };
