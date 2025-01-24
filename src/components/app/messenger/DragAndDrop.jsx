import React, { useContext, useEffect, useRef, useState } from "react";

import {
  createPartContainerService,
  endVideoPartService,
  uploadVideoService,
} from "../../../services/toMessenger";
import {
  getVideoDurationInSeconds,
  sliceOneVideo,
  sliceVideo,
} from "../../../helpers/utils";
import RecoveryToken from "./RecoveryToken";
import { recoveryModalId } from "../../../helpers/jsx-ids";
import { AppContext } from "../../../contexts/AppContextProvider";
import VideoPreview from "./VideoPreview";
import ExitFSModal from "./ExitFSModal";

export default function DragAndDrop() {
  const inputRef = useRef(0);
  const [videoName, setVideoName] = useState(null);
  const [videoToken, setVideoToken] = useState(null);
  const [uploadExceeded, setUploadExceeded] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isUploadPending, setIsUploadPending] = useState(false);
  const fullScreenRef = useRef(0);

  // full-screen handler

  const openFullscreen = () => {
    const elem = fullScreenRef.current;
    if (!elem) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  /* Close fullscreen */
  const closeFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  };

  const { ffmpeg } = useContext(AppContext);
  const cleanVideoState = () => {
    setVideoName(null);
    setVideoToken(null);
    setVideoPreview(null);
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
        setIsFullScreen(true);
        openFullscreen();
      }
    } catch (error) {}
  };

  const uploadVideo = async (video) => {
    const chunks = await sliceVideo(ffmpeg, video, 24);

    const partToken = await createPartContainerService(video.size);
    setVideoName(video.name);
    for (let position = 0; position < chunks.length; position++) {
      await uploadVideoService(
        chunks[position],
        partToken,
        video.name,
        position
      );
    }
    await endVideoPartService(partToken, video.size);
    setVideoToken(partToken);
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

  const exitFullScreen = () => {
    setIsFullScreen(false);
    closeFullscreen();
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", (event) => {
      if (!document.fullscreenElement) {
        event.preventDefault();
        confirmExitModal();
      }
    });
  }, []);

  const confirmExitModal = () => {
    document.getElementById("modal_exit_fs").showModal();
  };

  const uploadTrimVideo = async (video, startTime, endTime) => {
    try {
      setIsUploadPending(true);
      exitFullScreen();
      const videoDuration = await getVideoDurationInSeconds(video);
      if (startTime > 0 || endTime < videoDuration) {
        const videoTrimmed = await sliceOneVideo(
          ffmpeg,
          video,
          startTime,
          endTime
        );

        await uploadVideo(videoTrimmed);
      } else {
        await uploadVideo(video);
      }
    } catch (error) {
      console.error("error trime upload", error);
    } finally {
      setIsUploadPending(false);
    }
  };

  return (
    <>
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

      {isUploadPending && !videoToken && (
        <div className="my-4 text-center">
          <p className="flex gap-4 items-center justify-center">
            <span>Upload en cours...</span>
            <div className="relative">
              <div className="square">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 moving-svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                  />
                </svg>
              </div>
            </div>
          </p>
          <p>Ceci peut prendre un peu de temps. Ne reloader pas la page.</p>
        </div>
      )}

      <ExitFSModal exitFS={exitFullScreen} />
      <div ref={fullScreenRef}>
        {videoPreview && isFullScreen && (
          <VideoPreview
            videoPreview={videoPreview}
            uploadTrimVideo={uploadTrimVideo}
            exitFullScreen={confirmExitModal}
          />
        )}
      </div>

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
