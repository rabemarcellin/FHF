import React from "react";

export default function UploadProgress({ uploadProgress, videoSize }) {
  if (videoSize && parseInt(videoSize) > 0)
    return (
      <div className="my-4">
        <div className="flex justify-end font-mono">
          {Math.ceil((uploadProgress * 100) / videoSize)}%
        </div>

        <progress
          className="progress w-full"
          value={Math.ceil((uploadProgress * 100) / videoSize)}
          max={"100"}
        ></progress>
      </div>
    );
}
