import React, { useEffect, useState } from "react";
import { API_URL } from "../helpers/constants";
import UploadProgress from "./UploadProgress";

const ActiveUploads = ({ activeUploads, setActiveUploads }) => {
  const [isOpen, setIsOpen] = useState(false);

  return isOpen ? (
    <>
      <h1 className=" font-black">Upload active ({activeUploads.length})</h1>
      <div className="mt-2">
        {activeUploads.length > 0 ? (
          activeUploads.map((upload) => (
            <div
              key={upload._id}
              className="hover:bg-slate-100 px-4 hover:rounded-md border-b last:border-b-0"
            >
              <UploadProgress
                uploadProgress={upload.chunkLength}
                videoSize={upload.videoSize}
              />
            </div>
          ))
        ) : (
          <div> Aucun upload en cours</div>
        )}
      </div>
    </>
  ) : (
    <>
      <div className="skeleton h-4 w-20 my-2"></div>
      <div className="skeleton h-32 w-full"></div>
    </>
  );
};

export default ActiveUploads;
