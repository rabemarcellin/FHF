import React, { useEffect, useState } from "react";
import Timeline from "../../ui/Timeline";

const VideoPreview = ({ videoPreview, uploadTrimVideo, exitFullScreen }) => {
  const videoPreviewRef = React.useRef(null);
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const [videoPreviewSrc, setVideoPreviewSrc] = useState(null);

  // Update videoPreviewSrc and force reload the video
  useEffect(() => {
    let oldSrc = null;

    if (videoPreview) {
      const newSrc = URL.createObjectURL(videoPreview);
      setVideoPreviewSrc(newSrc);

      // Revoke old URL to avoid memory leaks
      if (oldSrc) {
        URL.revokeObjectURL(oldSrc);
      }
      oldSrc = newSrc;

      // Force the video to reload
      if (videoPreviewRef.current) {
        videoPreviewRef.current.load();
      }
    }

    // Cleanup on unmount or when videoPreview changes
    return () => {
      if (oldSrc) {
        URL.revokeObjectURL(oldSrc);
      }
    };
  }, [videoPreview]);

  return (
    videoPreviewSrc && (
      <div className="h-screen w-screen absolute top-0 left-0 z-20 bg-white flex items-center justify-center md:p-2">
        <div className="h-full md:h-[85vh] w-full md:min-w-96 md:w-96 md:rounded-2xl overflow-y-hidden overflow-x-auto">
          <div className="relative flex w-full h-full bg-black mx-auto justify-center items-center video-preview overflow-hidden">
            <div className="action action--top">
              <div className="flex justify-end m-4">
                <button
                  onClick={exitFullScreen}
                  className="f-btn"
                  data-tip="Quitter le plein écran"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="bg"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <video width="100%" ref={videoPreviewRef}>
              <source src={videoPreviewSrc} />
            </video>

            <div className="action action--bottom">
              <div className="flex justify-end items-end">
                <div className="flex flex-col justify-end gap-2 m-4">
                  <button
                    onClick={async () =>
                      await uploadTrimVideo(videoPreview, startTime, endTime)
                    }
                    className="f-btn"
                    data-tip="Uploader"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <Timeline
                  video={videoPreview}
                  player={videoPreviewRef}
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VideoPreview;
