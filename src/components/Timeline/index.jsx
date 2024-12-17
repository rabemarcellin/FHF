import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { useAsyncMemo } from "use-async-memo";
import {
  convertToHHMMSS,
  getVideoDurationInSeconds,
} from "../../helpers/utils";
import { getVideoPosition, moveSidebarLeft, moveSidebarRight } from "./utils";
import reducer from "./reducer";
import actionsType, {
  max_zoom_scale,
  min_zoom_scale,
  zoom_scale,
} from "./actions";

const initialState = {
  isPlaying: false,
  isDraggingLeft: false,
  isDraggingRight: false,
  cutStartPosition: 0,
  cutEndPosition: 0,
  cutVideoSize: 0,
  scale: 1,
};

let zoomSliderWidth = 0;
let prevScale = 1;

const Timeline = ({ video }) => {
  // timeline state
  const sliderContainerRef = useRef(null);
  const sliderLeftRef = useRef(null);
  const sliderRightRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  // video state
  const videoDurationBrut = useAsyncMemo(async () => {
    return await getVideoDurationInSeconds(video);
  }, [video]);

  // Convertir 5 secondes en pixels
  const minDistanceInPixels = useMemo(() => {
    if (sliderContainerRef.current && videoDurationBrut) {
      const sliderWidth =
        sliderContainerRef.current.getBoundingClientRect().width;
      return (5 / videoDurationBrut) * sliderWidth;
    }
    return 0;
  }, [sliderContainerRef, videoDurationBrut]);

  const cutStartTime = useMemo(() => {
    if (state && sliderContainerRef.current && videoDurationBrut) {
      const sliderRect = sliderContainerRef.current.getBoundingClientRect();

      const videoElementWidth = (state.scale * sliderRect.width) / prevScale;

      const time = getVideoPosition(
        videoElementWidth,
        videoDurationBrut,
        state.cutStartPosition
      );

      return time;
    } else {
      return 0;
    }
  }, [state.cutStartPosition, sliderContainerRef, videoDurationBrut]);

  const cutEndTime = useMemo(() => {
    if (state && sliderContainerRef.current && videoDurationBrut) {
      const sliderRect = sliderContainerRef.current.getBoundingClientRect();

      const videoElementWidth = (state.scale * sliderRect.width) / prevScale;

      const time =
        videoDurationBrut -
        getVideoPosition(
          videoElementWidth,
          videoDurationBrut,
          state.cutEndPosition
        );

      return time;
    } else {
      return videoDurationBrut;
    }
  }, [
    state.cutEndPosition,
    sliderContainerRef.current,
    videoDurationBrut,
    state.scale,
  ]);

  const chunkSizeInMB = useMemo(() => {
    if (video.size && videoDurationBrut) {
      const selectedDuration = cutEndTime - cutStartTime; // Duration of the cut
      const totalSizeMB = video.size / (1024 * 1024); // Convert total size to MB
      const chunkSize = (selectedDuration / videoDurationBrut) * totalSizeMB; // Calculate chunk size proportionally
      return chunkSize.toFixed(2); // Round to 2 decimal places
    }
    return 0;
  }, [video.size, videoDurationBrut, cutStartTime, cutEndTime]);

  const mooveSlider = (event) => {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    if (state.isDraggingLeft) {
      const sliderRect = sliderContainerRef.current.getBoundingClientRect();
      const xLeftPosition = moveSidebarLeft(
        { clientX },
        sliderRect,
        sliderLeftRef.current,
        minDistanceInPixels,
        state.cutEndPosition
      );
      dispatch({
        type: actionsType.MOVE_SLIDER,
        startXPosition: xLeftPosition,
      });
    }

    if (state.isDraggingRight) {
      const sliderRect = sliderContainerRef.current.getBoundingClientRect();
      const xRightPosition = moveSidebarRight(
        { clientX },
        sliderRect,
        sliderRightRef.current,
        minDistanceInPixels,
        state.cutStartPosition
      );
      dispatch({
        type: actionsType.MOVE_SLIDER_END,
        startXPosition: sliderRect.width - xRightPosition,
      });
    }
  };

  const untrackDragging = () => {
    if (state.isDraggingLeft) {
      dispatch({ type: actionsType.END_DRAG_LEFT });
    }

    if (state.isDraggingRight) {
      dispatch({ type: actionsType.END_DRAG_RIGHT });
    }
  };

  const adaptZoom = (newScale) => {
    const sliderRect = sliderContainerRef.current.getBoundingClientRect();
    zoomSliderWidth = sliderRect.width;

    const newCutStartPosition =
      (state.cutStartPosition * newScale) / state.scale;
    const newCutEndPosition = (state.cutEndPosition * newScale) / state.scale;

    dispatch({
      type: actionsType.MOVE_SLIDER,
      startXPosition: newCutStartPosition,
    });
    sliderLeftRef.current.style.left = newCutStartPosition + "px";

    dispatch({
      type: actionsType.MOVE_SLIDER_END,
      startXPosition: newCutEndPosition,
    });

    sliderRightRef.current.style.left =
      (zoomSliderWidth * newScale) / state.scale -
      newCutEndPosition -
      sliderRightRef.current.getBoundingClientRect().width * 2 +
      "px";
  };

  const zoomIn = () => {
    if (state.scale < max_zoom_scale) {
      dispatch({ type: actionsType.ZOOM_IN });
      const newScale = state.scale + zoom_scale;
      adaptZoom(newScale);
    }
  };

  const zoomOut = () => {
    if (state.scale > min_zoom_scale) {
      dispatch({ type: actionsType.ZOOM_OUT });

      const newScale = state.scale - zoom_scale;
      adaptZoom(newScale);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      prevScale = state.scale;
    }, 500);
  }, [state.scale]);
  return (
    <div className="border border-white/25 shadow-sm shadow-white/10 bg-black m-4 text-white rounded-xl">
      {/* <div className="border-b border-white/25">
          <div className="flex justify-between gap-1 m-2 overflow-hidden">
          {Array.from(
            { length: Math.ceil((videoDurationBrut || 0) / 1) },
            (_, i) => (
              <div key={i}>{i}s</div>
            )
          )}
        </div> 
      </div>*/}
      <div className="p-2">
        <div className="h-full bg-white/15 rounded-md p-1 overflow-y-hidden overflow-x-auto">
          <div
            ref={sliderContainerRef}
            onMouseMove={mooveSlider}
            onMouseUp={untrackDragging}
            onTouchMove={mooveSlider}
            onTouchEnd={untrackDragging}
            className="slider min-h-8"
            style={{
              "--start-time-position": state.cutStartPosition + "px",
              "--end-time-position": state.cutEndPosition + "px",
              width: state.scale * 100 + "vw",
            }}
          >
            <div className="h-full w-px absolute top-0 left-0">
              <div className="relative flex items-center h-full ">
                <div
                  ref={sliderLeftRef}
                  onMouseDown={() => {
                    dispatch({ type: actionsType.START_DRAG_LEFT });
                  }}
                  onTouchStart={() =>
                    dispatch({ type: actionsType.START_DRAG_LEFT })
                  }
                  className={`absolute h-[80%] w-px bg-white/50 rounded border-2 border-white/50 cursor-pointer ${
                    state.isDraggingLeft ? "scale-150" : ""
                  } hover:scale-150 transition duration-200`}
                >
                  <div className="relative z-20">
                    <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-full bg-black px-1 rounded-xl">
                      {convertToHHMMSS(cutStartTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full w-px absolute top-0 left-0">
              <div className="flex items-center h-full relative">
                <div
                  ref={sliderRightRef}
                  onMouseDown={() => {
                    dispatch({ type: actionsType.START_DRAG_RIGHT });
                  }}
                  onTouchStart={() =>
                    dispatch({ type: actionsType.START_DRAG_RIGHT })
                  }
                  className={`absolute h-[80%] w-px bg-white/50 rounded border-2 border-white/50 cursor-pointer ${
                    state.isDraggingRight ? "scale-150" : ""
                  } hover:scale-150 transition duration-200`}
                >
                  <div className="relative z-20">
                    <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-full bg-black px-1 rounded-xl">
                      {convertToHHMMSS(cutEndTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-2 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <button
              className="f-btn active:scale-110 transition duration-300"
              onClick={zoomIn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                />
              </svg>
            </button>

            <button
              className="f-btn active:scale-110 transition duration-300"
              onClick={zoomOut}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
                />
              </svg>
            </button>

            <div>{chunkSizeInMB + "MB"}</div>
          </div>
          {/*  <div>
            {state.isPlaying ? (
              <div
                className="tooltip tooltip-top z-10"
                data-tip="Pause"
                onClick={() => {
                  dispatch({ type: actionsType.PAUSE_VIDEO });
                }}
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
                    d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            ) : (
              <div
                className="tooltip tooltip-top z-10 bg-black/50 rounded-full p-px m-px"
                data-tip="Play"
                onClick={() => {
                  dispatch({ type: actionsType.PLAY_VIDEO });
                }}
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
          </div> */}
          <div className="flex justify-end gap-1">
            <section>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
                />
              </svg>
            </section>
            <section>{convertToHHMMSS(cutStartTime)}</section>/
            <section>{convertToHHMMSS(cutEndTime)}</section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
