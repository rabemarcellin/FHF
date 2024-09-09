import React, { useEffect, useState } from "react";
import DragAndDrop from "../../components/DragAndDrop";
import UploadProgress from "../../components/UploadProgress";

export default function Landing() {
  const [videoSize, setVideoSize] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunkUploaded, setChunkUploaded] = useState(0);

  useEffect(() => {
    if (chunkUploaded % uploadProgress == 0 || chunkUploaded === videoSize) {
      setUploadProgress(0);
    }
  }, [chunkUploaded, uploadProgress, videoSize]);

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-[60%]">
        <div className="max-w-3xl mx-auto h-full py-8">
          <DragAndDrop
            setChunkUploaded={setChunkUploaded}
            setUploadProgress={setUploadProgress}
            setVideoSize={setVideoSize}
          />
        </div>
      </div>
      <div className="w-full h-[40%] overflow-auto">
        <div className="max-w-3xl mx-auto">
          <UploadProgress
            chunkUploaded={chunkUploaded}
            uploadProgress={uploadProgress}
            videoSize={videoSize}
          />
        </div>
      </div>
    </div>
  );
}
