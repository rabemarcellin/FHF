import React, { useEffect, useRef, useState } from "react";
import { uploadChunkService } from "../services/upload";

export default function DragAndDrop({
  setChunkUploaded,
  setUploadProgress,
  setVideoSize,
}) {
  const inputRef = useRef(0);
  const [videoName, setVideoName] = useState(null);

  const handleUpload = async (event) => {
    setChunkUploaded(0);
    const video = event.target.files[0];
    console.log(video);
    setVideoSize(parseInt(video.size));
    setVideoName(video.name);
    const chunkSize = 5 * 1024 * 1024; // chunk by 5Mb

    const getEnd = (chunkStart) => Math.min(chunkStart + chunkSize, video.size);

    let chunkIndex = 0;
    let chunkStart = 0;

    while (chunkStart < video.size) {
      const end = getEnd(chunkStart);
      const videoChunk = video.slice(chunkStart, end);
      const reader = await uploadChunkService(chunkIndex + 1, videoChunk);
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        if (typeof JSON.parse(chunk) === "number") {
          console.log(chunk);
          if (chunk.toString().length < video.size.toString().length) {
            setUploadProgress(JSON.parse(chunk));
          }
        } else {
          console.log(chunk);
          const data = JSON.parse(chunk);
          setChunkUploaded((lastState) => lastState + data.totalChunks);
        }
      }

      chunkStart = end;
      chunkIndex++;
    }
  };

  return (
    <div
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      }}
      className="p-4 cursor-pointer w-full  h-full bg-white rounded-md shadow-lg"
    >
      <div className=" flex  justify-center items-center h-full border-dashed  border-4">
        <div>
          {videoName ? videoName : "Cliquer ici pour televerser un fichier"}
        </div>
        <input
          ref={inputRef}
          onChange={handleUpload}
          type="file"
          name="bank"
          accept="video/*"
          hidden
        />
      </div>
    </div>
  );
}
