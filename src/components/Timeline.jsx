import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAsyncMemo } from "use-async-memo";
import { convertToHHMMSS, getVideoDurationInSeconds } from "../helpers/utils";

const Timeline = ({ video }) => {
  // timeline state
  const sliderContainerRef = useRef(null);
  const sliderLeftRef = useRef(null);
  const sliderRightRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0); // position de slider après dragging

  // player state
  const [isPlaying, setIsPlaying] = useState(false);

  // video state
  const videoDurationBrut = useAsyncMemo(async () => {
    return await getVideoDurationInSeconds(video);
  }, [video]);

  const videoDurationFormated = useMemo(
    () => convertToHHMMSS(videoDurationBrut),
    [videoDurationBrut]
  );

  console.log(videoDurationBrut, videoDurationFormated);

  const trakDragging = (event) => {
    setIsDragging(true);
    setStartPoint(event.clientX);
  };

  const mooveSlider = (event) => {
    if (!isDragging) return;

    const delta = event.clientX - startPoint;
    setCurrentOffset((prevState) => Math.max(0, prevState + delta));
    setStartPoint(event.clientX);
  };

  const untrackDragging = () => {
    console.log("leave the dragging");
    setIsDragging(false);
  };

  useEffect(() => {
    console.log("startPoint: ", startPoint);
  }, [startPoint]);

  useEffect(() => {
    if (sliderContainerRef.current && sliderLeftRef.current) {
      // maintain click on sliderLeftBar
      // user touch, mobile view
      /* sliderLeftRef.current.addEventListener("touchstart", (event) => {
        isDragging = true;
        startPointX = event.touches[0].clientX;
      });
      sliderLeftRef.current.addEventListener("touchend", (event) => {
        isDragging = false;
        startPointX = 0;
      }); */
    }
  }, [sliderLeftRef, sliderContainerRef]);
  return (
    <div className="bg-white/15 m-4 text-white rounded-xl">
      <div className="flex justify-center items-center gap-2 border-b border-white/25">
        <div>
          {isPlaying ? (
            <div className="tooltip tooltip-top z-10" data-tip="Pause">
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
            <div
              className="tooltip tooltip-top z-10 bg-black/50 rounded-full p-px m-px"
              data-tip="Play"
            >
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
        </div>
        <div>00:00 / {videoDurationFormated}</div>
      </div>
      <div className="border-b border-white/25">
        <div className="flex justify-between gap-1 mx-2">
          <div>0s</div>
          <div>1s</div>
          <div>2s</div>
        </div>
      </div>
      <div className="p-2">
        <div className="h-8 bg-white/5 rounded-md p-1">
          <div
            ref={sliderContainerRef}
            onMouseMove={mooveSlider}
            className="h-full bg-black/50 rounded border-2 border-white/50 relative"
          >
            <div className="h-full w-px absolute top-0 left-0">
              <div className="flex items-center h-full">
                <div
                  ref={sliderLeftRef}
                  onMouseDown={trakDragging}
                  onMouseUp={untrackDragging}
                  className="h-[80%] w-px bg-white/50 rounded border-2 border-white/50"
                ></div>
              </div>
            </div>

            <div className="h-full w-px absolute top-0 right-0">
              <div className="flex items-center h-full">
                <div
                  ref={sliderRightRef}
                  className="h-[80%] w-px bg-white/50 rounded border-2 border-white/50"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
