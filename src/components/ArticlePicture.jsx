import React, { useState } from "react";
import ImgCrossOrigin from "./ImgCrossOrigin";

const ArticlePicture = ({ title, src }) => {
  const [showMorePicture, setShowMorePicture] = useState(false);

  function downloadImage() {
    fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("div"); // Use any temporary element
        const anchor = link.appendChild(document.createElement("a")); // Temporary usage
        anchor.href = url;
        anchor.download = title;
        anchor.click();
        URL.revokeObjectURL(url); // Clean up the URL object
      })
      .catch((error) => console.error("Error downloading image:", error));
  }

  return (
    <>
      <div className="border border-gray-300 hover:shadow-md rounded-xl overflow-hidden bg-white relative">
        <div className="absolute top-0 right-0 z-10">
          <div className="flex gap-2 items-center p-2">
            <button
              onClick={() => setShowMorePicture(true)}
              data-tip="Voir"
              to="/article"
              className="tooltip tooltip-left before:text-xs  active:bg-black bg-black/90 w-8  h-8 rounded-full flex items-center justify-center  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 stroke-2 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
            <button
              onClick={downloadImage}
              data-tip="Télécharger"
              to="/article"
              className="tooltip tooltip-left before:text-xs  active:bg-black bg-black/90 w-8  h-8 rounded-full flex items-center justify-center transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4  stroke-2 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </button>
          </div>
        </div>
        <ImgCrossOrigin
          src={src}
          alt={title}
          className={"hover:scale-105 transition-all duration-300 -z-10"}
        />
      </div>

      {showMorePicture && (
        <div className="z-30 fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center">
          <div className="absolute top-0 right-0 p-2">
            <button
              onClick={() => setShowMorePicture(false)}
              data-tip="Fermer"
              to="/article"
              className="tooltip tooltip-left before:text-xs active:bg-black bg-black/90 w-8  h-8 rounded-full flex items-center justify-center transition duration-300 -translate-x-3/4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 stroke-2 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>
          <div className="w-96 bg-white md:rounded-xl h-full md:h-[90%] flex items-center">
            <ImgCrossOrigin
              src={src}
              alt={title}
              className={"hover:scale-105 transition-all duration-300"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlePicture;
