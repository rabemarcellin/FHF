import React, { useEffect, useState } from "react";
import { API_URL } from "../helpers/constants";
import UploadProgress from "./UploadProgress";

const ActiveUploads = ({ activeUploads, setActiveUploads }) => {
  const [isOpen, setIsOpen] = useState(false);

  const connectToServer = () => {
    try {
      const eventSource = new EventSource(`${API_URL}/upload/events`);

      if (!eventSource) {
        return;
      }
      eventSource.onopen = () => {
        console.log("Connected to server");
        setTimeout(() => {
          setIsOpen(true);
        }, 300);
      };

      eventSource.onerror = (error) => {
        console.error("Error connecting to server:", error);
        setIsOpen(true);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (!isOpen) setIsOpen(true);

        const isDifference = (prevData, newData) => {
          if (prevData.length !== newData.length) {
            return true;
          }

          return (
            prevData.filter((prevValue) =>
              newData.find(
                (newValue) =>
                  prevValue.partToken === newValue.partToken &&
                  prevValue.chunkLength !== newValue.chunkLength
              )
            ).length > 0
          );
        };

        if (data && Array.isArray(data))
          if (isDifference(activeUploads, data)) {
            setActiveUploads(data);
          }
      };
    } catch (error) {
      console.log("error see: ", error);
    } finally {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    // connectToServer();
  }, []);
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
