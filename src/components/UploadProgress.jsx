import React from "react";

export default function UploadProgress({
  chunkUploaded,
  uploadProgress,
  videoSize,
}) {
  return (
    !!videoSize && (
      <div className="my-8">
        <div className="flex justify-end">
          {Math.ceil(((chunkUploaded + uploadProgress) * 100) / videoSize)}%
        </div>
        <div className="bg-gray-500 p-px">
          <div
            className="bg-white w-px h-px transition-all duration-500"
            style={{
              width: `${Math.ceil(
                ((chunkUploaded + uploadProgress) * 100) / videoSize
              )}%`,
            }}
          />
        </div>
      </div>
    )
  );
}
