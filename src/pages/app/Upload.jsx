import React, { useEffect, useState } from "react";

import { Sheet } from "react-modal-sheet";

import DragAndDrop from "../../components/DragAndDrop";
import UploadProgress from "../../components/UploadProgress";
import AppNavbar from "../../components/AppNavbar";
import ActiveUploads from "../../components/ActiveUploads";
import { sleep } from "../../helpers/utils";

let lastScrollTop = 0;
let isInside = false;

export default function Upload() {
  const [videoSize, setVideoSize] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeUploads, setActiveUploads] = useState([]);
  const [openResponsiveActiveUploads, setOpenResponsiveActiveUploads] =
    useState(false);

  const [isScrollTop, setIsScrollTop] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;

    // Détection du défilement vers le haut
    if (scrollTop < lastScrollTop) {
      setIsScrollTop(true);
    }

    lastScrollTop = scrollTop;
  };

  const handleWheel = (event) => {
    // Détection du scroll vers le haut
    if (event.deltaY < 0) {
      setIsScrollTop(true);
    }
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const touchMoveY = touch.clientY;

    if (touchMoveY < lastScrollTop) {
      setIsScrollTop(true);
    }

    lastScrollTop = touchMoveY;
  };

  const handleMouseLeave = async () => {
    isInside = false;

    await sleep(2000);
    if (!isInside) setIsScrollTop(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    if (isScrollTop) {
      const verifyMenu = async () => {
        await sleep(5000);
        setTimeout(() => {
          if (!isInside) {
            setIsScrollTop(false);
          }
        }, 1000);
      };
      verifyMenu();
    }
  }, [isScrollTop]);

  return (
    <div className="w-screen">
      <AppNavbar />
      <div className="w-full flex gap-4 justify-center px-8">
        <div className="w-full max-w-2xl pt-4">
          <DragAndDrop
            setUploadProgress={setUploadProgress}
            setVideoSize={setVideoSize}
            activeUploads={activeUploads}
          />
          <UploadProgress
            uploadProgress={uploadProgress}
            videoSize={videoSize}
          />
        </div>
        <div className="hidden lg:block w-full max-w-96 border m-4 h-fit bg-white shadow rounded-xl p-4">
          <ActiveUploads
            activeUploads={activeUploads}
            setActiveUploads={setActiveUploads}
          />
        </div>

        {/* Section responsive */}
        {isScrollTop && (
          <div
            className="block lg:hidden fixed bottom-0 left-0 w-full"
            onMouseEnter={() => {
              isInside = true;
            }}
            onMouseLeave={handleMouseLeave}
          >
            {openResponsiveActiveUploads && (
              <div className="p-4 bg-white border-t">
                <ActiveUploads
                  activeUploads={activeUploads}
                  setActiveUploads={setActiveUploads}
                />
              </div>
            )}
            <div
              onClick={() => {
                if (activeUploads.length > 0) {
                  setOpenResponsiveActiveUploads(true);
                }
              }}
              className="w-full bg-white border-t p-4 hover:shadow cursor-pointer select-none"
            >
              <div className="flex justify-center items-center gap-2 font-black">
                <div className="indicator">
                  <span className="indicator-item badge shadow badge-neutral font-black">
                    {activeUploads.length}
                  </span>
                  <div className="flex gap-2 m-1.5">
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
                        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Sheet
          rootId="here"
          isOpen={openResponsiveActiveUploads}
          onClose={() => {
            setOpenResponsiveActiveUploads(false);
            setIsScrollTop(false);
          }}
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <ActiveUploads
                activeUploads={activeUploads}
                setActiveUploads={setActiveUploads}
              />
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </div>
    </div>
  );
}