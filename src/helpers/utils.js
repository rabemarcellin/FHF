import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export const getVideoDurationInSeconds = (video) => {
  return new Promise((resolve, reject) => {
    try {
      if (video) {
        const videoElement = document.createElement("video");
        const fileURL = URL.createObjectURL(video);

        // Charger la vidéo dans l'élément <video>
        videoElement.src = fileURL;

        // Attendre que les métadonnées soient chargées
        videoElement.addEventListener("loadedmetadata", () => {
          const videoDuration = videoElement.duration; // Durée en secondes
          console.log(videoDuration, "v");
          resolve(videoDuration);
        });
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
// Convertir les timestamps au format hh:mm:ss
export const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export const handleStream = (reader, handleContinue) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        const chunks = chunk.split("\n");
        const progress = chunks
          .filter((res) => !!parseInt(res))
          .map(Number)
          .reduce((acc, curr) => acc + curr, 0);
        const doneResponse = chunks.find((res) => {
          try {
            const status =
              JSON.parse(res) && JSON.parse(res).constructor === Object;
            return status;
          } catch (error) {
            return false;
          }
        });
        if (doneResponse) {
          resolve(JSON.parse(doneResponse));
        } else if (progress) {
          handleContinue(progress);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const geVideoDurationBySize = (videoDuration, videoSize) => {
  const sizeToTimeRatio = videoDuration / videoSize; // seconds per byte

  // Calculate the duration of each chunk in seconds
  const chunkDuration = chunkSize * sizeToTimeRatio;
  return chunkDuration;
};

export const loadFFmpeg = async () => {
  const ffmpeg = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";

  // toBlobURL is used to bypass CORS issue, urls with the same
  // domain can be used directly.
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    /*workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript"
    ),*/
  });
  return ffmpeg;
};

export const sliceOneVideo = async (ffmpeg, video, startTime, endTime) => {
  const fileData = await fetchFile(video);
  await ffmpeg.writeFile(video.name, fileData);
  const chunkFileName = `trim_${video.name}.mp4`;

  await ffmpeg.exec([
    "-i",
    video.name,
    "-ss",
    `${startTime}`,
    "-to",
    `${endTime}`,
    "-acodec",
    "copy",
    "-vcodec",
    "copy",
    chunkFileName,
  ]);

  // Read the chunk from FFmpeg's virtual file system
  const outputChunk = await ffmpeg.readFile(chunkFileName);

  const trimmedVideoBlob = new Blob([outputChunk], { type: "video/mp4" });

  // Create a File object if required by sliceVideo
  const trimmedVideoFile = new File([trimmedVideoBlob], "trimmed_video.mp4", {
    type: "video/mp4",
  });

  return trimmedVideoFile;
};
/**
 *
 * @param {*} video
 * @param {Number} chunkSize - size in MB
 * @returns
 */
export const sliceVideo = async (ffmpeg, video, chunkSizeLength = 5) => {
  // Store video data in ffmpeg's virtual file system
  const fileData = await fetchFile(video);
  await ffmpeg.writeFile(video.name, fileData);

  const chunkSize = chunkSizeLength * 1024 * 1024; // 5MB in bytes
  const videoDuration = await getVideoDurationInSeconds(video);
  console.log("videoDuration", videoDuration);
  const chunks = [];
  const videoSize = video.size;

  // seconds per byte
  const sizeToTimeRatio = videoDuration / videoSize;

  // Calculate the duration of each chunk in seconds
  const chunkDuration = chunkSize * sizeToTimeRatio;
  let startTime = 0;

  // Run FFmpeg to slice the video into chunks
  let index = 0;
  while (startTime < videoSize) {
    const endTime = Math.min(startTime + chunkDuration, videoDuration);
    if (startTime === endTime) break;
    // Set the output file name for the chunk
    const chunkFileName = `output_chunk_${index}.mp4`;

    // Run FFmpeg to slice the video
    await ffmpeg.exec([
      "-i",
      video.name,
      "-ss",
      `${startTime}`,
      "-to",
      `${endTime}`,
      "-acodec",
      "copy",
      "-vcodec",
      "copy",
      chunkFileName,
    ]);

    // Read the chunk from FFmpeg's virtual file system
    const outputChunk = await ffmpeg.readFile(chunkFileName);
    // Create a Blob from the chunk and add it to the chunks array
    const chunkBlob = new Blob([outputChunk], { type: "video/mp4" });
    chunks.push(chunkBlob);

    // Move to the next slice
    startTime = endTime;
    index++;
  }

  return chunks;
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const convertToHHMMSS = (val) => {
  const secNum = parseInt(val, 10);
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - hours * 3600) / 60);
  let seconds = secNum - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  let time;
  // only mm:ss
  if (hours === "00") {
    time = minutes + ":" + seconds;
  } else {
    time = hours + ":" + minutes + ":" + seconds;
  }
  return time;
};
