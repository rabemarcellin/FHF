rueimport React, { useContext, useEffect, useState } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { convertToHHMMSS, sliceOneVideo } from "../helpers/utils"; // Assuming you have this helper function
import { AppContext } from "../contexts/AppContextProvider";

const VideoPreview = ({
  videoPreview,
  videoPreviewDuration,
  updateOnSliderChange,
  uploadVideo,
}) => {
  const videoPreviewRef = React.useRef(null);
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const [videoPreviewSrc, setVideoPreviewSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSize, setVideoSize] = useState(0); // Total video size in MB
  const [chunkSize, setChunkSize] = useState(0);
  const { ffmpeg } = useContext(AppContext);

  // Update endTime when videoPreviewDuration changes
  useEffect(() => {
    if (videoPreviewDuration) {
      setEndTime(videoPreviewDuration);
    }
  }, [videoPreviewDuration]);

  // Update videoPreviewSrc and force reload the video
  useEffect(() => {
    let oldSrc = null;

    if (videoPreview) {
      const newSrc = URL.createObjectURL(videoPreview);
      setVideoPreviewSrc(newSrc);

      if (videoPreview.size) {
        setVideoSize((videoPreview.size / (1024 * 1024)).toFixed(2)); // Convert bytes to MB
      }
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

  useEffect(() => {
    const video = videoPreviewRef.current;

    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > endTime) {
        video.pause();
        video.currentTime = startTime; // Reset to the start of the range
        setIsPlaying(false);
      }
    };

    const handlePlay = () => {
      if (video.currentTime < startTime || video.currentTime > endTime) {
        video.currentTime = startTime;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);

    // Cleanup on unmount
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
    };
  }, [startTime, endTime]);

  useEffect(() => {
    if (videoSize && videoPreviewDuration) {
      const durationRatio = (endTime - startTime) / videoPreviewDuration;
      setChunkSize((videoSize * durationRatio).toFixed(2)); // Chunk size in MB
    }
  }, [startTime, endTime, videoSize, videoPreviewDuration]);

  const handleSliderChange = (values, handle) => {
    const readValue = parseInt(values[handle], 10);

    if (handle === 1) {
      // End time handle
      if (endTime !== readValue) {
        setEndTime(readValue);
      }
    } else {
      // Start time handle
      if (startTime !== readValue) {
        if (videoPreviewRef.current) {
          videoPreviewRef.current.currentTime = readValue;
        }
        setStartTime(readValue);
      }
    }
  };

  const togglePlayPause = () => {
    const video = videoPreviewRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      if (video.currentTime < startTime || video.currentTime > endTime) {
        video.currentTime = startTime;
      }
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const uploadTrimVideo = async () => {
    //

    if (startTime > 0 || endTime < videoPreviewDuration) {
      const videoTrimmed = await sliceOneVideo(
        ffmpeg,
        videoPreview,
        startTime,
        endTime
      );
      
      await uploadVideo(videoTrimmed);
    } else {
      await uploadVideo(videoPreview);
      
    }
  };

  return (
    videoPreviewSrc && (
      <div className="my-4">
        <div className="flex items-center justify-between">
          <div className="my-4 text-sm">Taille: {chunkSize} Mb </div>
          <div>
            {chunkSize < 100 ? (
              <div>
                <button className="btn btn-primary" onClick={uploadTrimVideo}>
                  Uploader
                </button>
              </div>
            ) : (
              <div className="text-sm items-center text-red-800 flex gap-2">
                <div>
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
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
                <div>100Mb maximum</div>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex justify-center items-center video-preview overflow-hidden rounded-2xl"
          style={{
            "--start-time-percent": `${
              100 - (startTime / videoPreviewDuration) * 100
            }%`,
            "--end-time-percent": `${(endTime / videoPreviewDuration) * 100}%`,
          }}
        >
          <video width="100%" ref={videoPreviewRef}>
            <source src={videoPreviewSrc} />
          </video>
        </div>

        <div className="flex items-center justify-center my-4">
          <button onClick={togglePlayPause} className="play-pause-button">
            {isPlaying ? (
              <div className="tooltip tooltip-right" data-tip="Pause">
                <svg
                  /* pause */
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
                    d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            ) : (
              <div className="tooltip tooltip-right" data-tip="Play">
                <svg
                  /* play */
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
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
        {videoPreviewDuration && (
          <Nouislider
            behaviour="tap-drag"
            step={1}
            margin={3}
            range={{ min: 0, max: videoPreviewDuration }}
            start={[0, videoPreviewDuration]}
            connect
            onUpdate={handleSliderChange}
          />
        )}

        <div className="my-4 text-sm">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div>Start duration</div>
              <div className="bg-neutral text-white py-1 px-2 rounded">
                {convertToHHMMSS(startTime)}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div>End duration</div>
              <div className="bg-neutral text-white py-1 px-2 rounded">
                {convertToHHMMSS(endTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VideoPreview;
