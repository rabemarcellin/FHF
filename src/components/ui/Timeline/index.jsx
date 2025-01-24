import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAsyncMemo } from "use-async-memo";
import {
  convertToHHMMSS,
  getVideoDurationInSeconds,
} from "../../../helpers/utils";
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
  playerPosition: 0,
};

let zoomSliderWidth = 0;
let prevScale = 1;

const Timeline = ({ video, player, setStartTime, setEndTime }) => {
  // timeline state
  const sliderContainerRef = useRef(null);
  const sliderLeftRef = useRef(null);
  const sliderRightRef = useRef(null);
  const containerRef = useRef(null);
  const playerTimelineRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDrag, setIsDrag] = useState(false);
  const [isDragPlayer, setIsDragPlayer] = useState(false);
  const [dragPointer, setDragPointer] = useState(0);
  const [previewInterval, setPreviewInterval] = useState(null);
  // video state
  const videoDurationBrut = useAsyncMemo(async () => {
    const duration = await getVideoDurationInSeconds(video);
    return duration;
  }, [video]);
  const [minDistanceInPixels, setMinDistanceInPixels] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(0);
  const cutStartTime = useMemo(() => {
    if (state && sliderContainerRef.current && videoDurationBrut) {
      const sliderRect = sliderContainerRef.current.getBoundingClientRect();

      const videoElementWidth = (state.scale * sliderRect.width) / prevScale;

      const time = getVideoPosition(
        videoElementWidth,
        videoDurationBrut,
        state.cutStartPosition
      );
      setStartTime(time);
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
      setEndTime(time);
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

  useEffect(() => {
    dispatch({
      type: actionsType.MOVE_SLIDER_END,
      startXPosition: 0,
    });
    const moveSidebarRightAsync = setInterval(() => {
      if (sliderContainerRef.current && sliderRightRef.current) {
        const sliderRect = sliderContainerRef.current.getBoundingClientRect();
        const sliderRightRect = sliderRightRef.current.getBoundingClientRect();

        if (sliderRect.width > 0 && sliderRightRect.width > 0) {
          clearInterval(moveSidebarRightAsync);
          sliderRightRef.current.style.left =
            sliderContainerRef.current.offsetWidth -
            sliderRightRef.current.offsetWidth * 3 +
            "px";

          const sliderWidth =
            sliderContainerRef.current.getBoundingClientRect().width;

          setMinDistanceInPixels((10 / videoDurationBrut) * sliderWidth);
        }
      }
    }, 200);
  }, [videoDurationBrut]);

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
    const sliderRect = sliderContainerRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const sliderBarWidth = sliderLeftRef.current.getBoundingClientRect().width;
    const endPosition = sliderWidth - state.cutEndPosition - sliderBarWidth * 2;
    const clientXFromSlider = clientX - sliderRect.left;

    if (
      state.cutStartPosition < clientXFromSlider &&
      clientXFromSlider < endPosition
    ) {
      sliderContainerRef.current.classList.add("cursor-grabbing");
    } else {
      sliderContainerRef.current.classList.remove("cursor-grabbing");
    }

    if (isDrag && !state.isDraggingLeft && !state.isDraggingRight) {
      const deltaX = clientXFromSlider - dragPointer;

      let newStart;
      let newEnd;
      let newEndPosition;

      newStart = Math.max(0, state.cutStartPosition + deltaX);
      newEnd = Math.max(0, state.cutEndPosition - deltaX);
      newEndPosition = Math.min(
        sliderWidth - sliderBarWidth,
        endPosition + deltaX
      );

      if (newStart === 0) {
        newEnd = Math.min(newEnd, state.cutEndPosition);
        newEndPosition = Math.min(newEndPosition, endPosition);
      }
      if (newEnd === 0) {
        newStart = Math.min(newStart, state.cutStartPosition);
      }

      dispatch({
        type: actionsType.MOVE_SLIDER,
        startXPosition: newStart,
      });
      sliderLeftRef.current.style.left = newStart + "px";

      dispatch({
        type: actionsType.MOVE_SLIDER_END,
        startXPosition: newEnd,
      });

      sliderRightRef.current.style.left = newEndPosition + "px";
      setDragPointer(clientXFromSlider);
      // move slider left and right
    }

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

  const untrackDragging = (event) => {
    dispatch({ type: actionsType.END_DRAG_LEFT });

    dispatch({ type: actionsType.END_DRAG_RIGHT });

    setIsDrag(false);

    sliderContainerRef.current.classList.remove("cursor-grabbing");

    setDragPointer(0);
    containerRef.current.classList.replace(
      "overflow-x-hidden",
      "overflow-x-auto"
    );
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

  const dragAllSlider = (event) => {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    const sliderRect = sliderContainerRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const sliderBarWidth = sliderLeftRef.current.getBoundingClientRect().width;
    const clientXFromSlider = clientX - sliderRect.left;
    const endPosition = sliderWidth - state.cutEndPosition - sliderBarWidth * 2;
    if (
      state.cutStartPosition < clientXFromSlider &&
      clientXFromSlider < endPosition
    ) {
      setIsDrag(true);
      setDragPointer(clientXFromSlider);

      containerRef.current.classList.replace(
        "overflow-x-auto",
        "overflow-x-hidden"
      );
    }
  };

  const handlePlayerMouseMove = (event) => {
    const playerTimelineRect =
      playerTimelineRef.current.getBoundingClientRect();

    const point = {
      x: event.touches[0].pageX - playerTimelineRect.left,
      y: event.touches[0].pageY - playerTimelineRect.top,
    };

    if (
      false ==
      (point.x >= 0 &&
        point.x <= playerTimelineRect.width &&
        point.y >= 0 &&
        point.y <= playerTimelineRect.height)
    ) {
      handlePlayerDrag(event);
      setIsDragPlayer(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mouseup", untrackDragging);
    document.addEventListener("touchend", untrackDragging);
    document.addEventListener("touchmove", handlePlayerMouseMove);

    return () => {
      document.removeEventListener("mouseup", untrackDragging);
      document.removeEventListener("touchend", untrackDragging);
      document.removeEventListener("mousemove", handlePlayerMouseMove);
    };
  }, []);
  useEffect(() => {
    setTimeout(() => {
      prevScale = state.scale;
    }, 500);
  }, [state.scale]);

  const handlePlayerDrag = (event) => {
    if (isDragPlayer) {
      const playerTimelineRect =
        playerTimelineRef.current.getBoundingClientRect();
      const position = event.clientX - playerTimelineRect.left;

      const videoTime =
        (position / playerTimelineRect.width) * videoDurationBrut;
      player.current.currentTime = videoTime;
      if (playerTimelineRef.current && player.current) {
        const playerTimelineRect =
          playerTimelineRef.current.getBoundingClientRect();
        setPlayerPosition(
          (playerTimelineRect.width * videoTime) / videoDurationBrut
        );
      }
    }
  };

  return (
    <div className="border border-white/25 shadow-sm shadow-white/10 bg-black m-2 text-white rounded-xl">
      <div className="pb-2">
        <div className="text-center mt-1">
          {convertToHHMMSS(player.current?.currentTime || 0)}
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <button className="tooltip tooltip-left" data-tip="Prev">
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
                d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
              />
            </svg>
          </button>
          {state.isPlaying ? (
            <div
              className="tooltip tooltip-bottom z-10 bg-black/50 rounded-full p-px m-px"
              data-tip="Pause"
              onClick={() => {
                dispatch({ type: actionsType.PAUSE_VIDEO });
                if (player.current) {
                  player.current.pause();
                  clearInterval(previewInterval);
                  setPreviewInterval(null);
                }
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
              className="tooltip tooltip-bottom z-10 bg-black/50 rounded-full p-px m-px"
              data-tip="Play"
              onClick={() => {
                dispatch({ type: actionsType.PLAY_VIDEO });
                if (player.current) {
                  if (player.current.currentTime === videoDurationBrut) {
                    player.current.currentTime = 0;
                    setPlayerPosition(0);
                  }
                  player.current.play();

                  const interval = setInterval(() => {
                    const currentTime = player.current?.currentTime;
                    if (playerTimelineRef.current && currentTime) {
                      const playerTimelineRect =
                        playerTimelineRef.current.getBoundingClientRect();
                      setPlayerPosition(
                        (playerTimelineRect.width * currentTime) /
                          videoDurationBrut
                      );
                    }

                    if (currentTime >= videoDurationBrut) {
                      player.current.pause();
                      clearInterval(interval);
                      setPreviewInterval(null);
                      dispatch({ type: actionsType.PAUSE_VIDEO });
                    }
                  }, 1000);

                  setPreviewInterval(interval);
                }
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

          <button className="tooltip tooltip-right" data-tip="Next">
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
                d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
              />
            </svg>
          </button>
        </div>

        <div
          ref={containerRef}
          className="h-full bg-black/50 rounded-md p-1 relative overflow-x-auto"
        >
          <div
            ref={sliderContainerRef}
            onMouseMove={mooveSlider}
            onTouchMove={mooveSlider}
            onMouseDown={dragAllSlider}
            onTouchStart={dragAllSlider}
            onMouseUp={untrackDragging}
            onTouchEnd={untrackDragging}
            className="slider min-h-8"
            style={{
              "--start-time-position": state.cutStartPosition + "px",
              "--end-time-position": state.cutEndPosition + "px",
              width: state.scale * 100 + "%",
            }}
          >
            <div
              ref={playerTimelineRef}
              className="h-1 w-full absolute bottom-0 left-0 bg-white/50 z-20 cursor-pointer"
              onMouseDown={() => {
                setIsDragPlayer(true);
              }}
              onTouchStart={() => {
                setIsDragPlayer(true);
              }}
              onMouseMove={handlePlayerDrag}
              onTouchMove={handlePlayerDrag}
              onTouchEnd={(event) => {
                handlePlayerDrag(event);
                setIsDragPlayer(false);
              }}
              onMouseUp={(event) => {
                handlePlayerDrag(event);
                setIsDragPlayer(false);
              }}
              onMouseLeave={(event) => {
                handlePlayerDrag(event);
                setIsDragPlayer(false);
              }}
            >
              <div
                className="absolute top-0 left-0 w-2 h-full bg-blue-500"
                style={{
                  width: playerPosition + "px",
                }}
              ></div>
            </div>
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
                    <div className="absolute bottom-0 left-0 translate-x-0 translate-y-full bg-black px-1 rounded-xl">
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
                    <div className="absolute bottom-0 left-0 -translate-x-full translate-y-full bg-black px-1 rounded-xl">
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
          <div className="flex gap-1 items-center">
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
            <div>{state.scale}x</div>

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
