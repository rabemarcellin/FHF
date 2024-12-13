import React, { useContext, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import {
  createPartContainerService,
  endVideoPartService,
  uploadStreamVideo,
  uploadVideoService,
} from "../services/upload";
import {
  getVideoDurationInSeconds,
  handleStream,
  sliceVideo,
} from "../helpers/utils";
import RecoveryToken from "./RecoveryToken";
import { recoveryModalId } from "../helpers/jsx-ids";
import { AppContext } from "../contexts/AppContextProvider";
import VideoPreview from "./VideoPreview";
import UploadProgress from "./UploadProgress";

export default function DragAndDrop({ activeUploads }) {
  const inputRef = useRef(0);
  const [videoName, setVideoName] = useState(null);
  const [videoToken, setVideoToken] = useState(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [uploadExceeded, setUploadExceeded] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoPreviewDuration, setVideoPreviewDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoSize, setVideoSize] = useState(null);

  // full-screen handler
  const handleFullScreen = useFullScreenHandle();

  const initUploadProgress = () => setUploadProgress(0);
  const { ffmpeg } = useContext(AppContext);
  const cleanVideoState = () => {
    setVideoName(null);
    setVideoToken(null);
    setVideoSize(0);
    initUploadProgress();
    setVideoPreview(null);
    setVideoPreviewDuration(0);
    inputRef.current.value = null;
  };
  const reInitUploader = () => {
    cleanVideoState();
    inputRef.current.click();
  };

  const importVideoFromLocal = async (event) => {
    try {
      const video = event.target.files[0];
      // Roadmap: verify imported is video and only one

      if (video) {
        setVideoPreview(video);
        await handleFullScreen.enter();
      }
    } catch (error) {}
    await handleFullScreen.enter();

    /*  try {
      initUploadProgress();
      const video = event.target.files[0];
      if (!video) {
        cleanVideoState();
        return;
      }
      setVideoPreview(video);

      if (activeUploads.length >= 5) {
        setUploadExceeded(true);

        setTimeout(() => {
          setUploadExceeded(false);
        }, 5000);

        return;
      } else {
      }
      const videoDuration = await getVideoDurationInSeconds(video);

      setVideoPreviewDuration(videoDuration);
    } catch (error) {
      if (error.message === "upload number attempts exceeded") {
        setUploadExceeded(true);

        setTimeout(() => {
          setUploadExceeded(false);
        }, 5000);
      } else {
        console.error(error);
      }
    } finally {
      setLoadVideo(false);
    } */
  };

  const uploadVideo = async (video) => {
    const chunks = await sliceVideo(ffmpeg, video, 24);

    setLoadVideo(false);

    const partToken = await createPartContainerService(video.size);
    setVideoSize(parseInt(video.size));
    setVideoName(video.name);
    for (let position = 0; position < chunks.length; position++) {
      console.log(chunks[position], video.size);
      const uploadStatus = await uploadVideoService(
        chunks[position],
        partToken,
        video.name,
        position
      );

      console.log("u_status: ", uploadStatus);
    }
    await endVideoPartService(partToken, video.size);
    setVideoToken(partToken);
    setUploadProgress(video.size);
    showToken();
  };

  const uploadLocalVideo = () => {
    if (inputRef.current && !videoToken) {
      inputRef.current.click();
    }
  };

  const showToken = () => {
    document.getElementById(recoveryModalId).showModal();
  };

  const exitFullScreen = async () => {
    await handleFullScreen.exit();
    cleanVideoState();
  };

  return (
    <>
      {loadVideo && (
        <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center gap-2 backdrop-blur z-10">
          <span>Chargement de la video </span>
          <span className="loading loading-dots loading-xs"></span>
        </div>
      )}
      {uploadExceeded && (
        <div className="absolute bottom-0 right-0 left-0 w-screen">
          <div className="flex items-center justify-center">
            <div
              role="alert"
              className="alert alert-warning  hover:border-black w-fit m-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>

              <div>
                <h3 className="font-bold">
                  Le nombre maximum d'upload est atteint (5) !
                </h3>
                <div className="text-xs">
                  Attendre à ce qu'un upload soit terminé et réessayer.
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  uploadLocalVideo();
                  setUploadExceeded(false);
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={uploadLocalVideo}
        className="p-4 cursor-pointer w-full bg-white rounded-md shadow-lg"
      >
        <div className="flex justify-center items-center  border-dashed p-2  border-4">
          <section className="w-full">
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 ${videoName ? "animate-bounce" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                />
              </svg>
            </div>
            <div className="flex justify-center max-w-lg overflow-x-hidden items-center my-2">
              {videoName ? videoName : "Cliquer ici pour téléverser un fichier"}
            </div>
            {videoToken && (
              <div className="flex items-center justify-center">
                <button
                  className="btn font-mono btn-neutral w-full"
                  onClick={showToken}
                >
                  Voir la clé
                </button>
              </div>
            )}
          </section>

          <input
            ref={inputRef}
            onChange={importVideoFromLocal}
            type="file"
            name="bank"
            accept="video/*"
            hidden
          />
        </div>
      </div>

      <UploadProgress uploadProgress={uploadProgress} videoSize={videoSize} />

      {videoPreview && (
        <FullScreen handle={handleFullScreen}>
          <VideoPreview
            videoPreview={videoPreview}
            videoPreviewDuration={videoPreviewDuration}
            uploadVideo={uploadVideo}
            exitFullScreen={exitFullScreen}
          />
        </FullScreen>
      )}

      {videoToken && (
        <div className=" p-2 my-4">
          <button className="btn w-full" onClick={reInitUploader}>
            Uploader à nouveau
          </button>
        </div>
      )}
      <RecoveryToken token={videoToken} />
    </>
  );
}
