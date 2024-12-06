import React from "react";
import DemoImg from "../../assets/img/demo.png";
import AppNavbar from "../../components/AppNavbar";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="lg:h-scree lg:overflow-y-hidde pb-8">
      <AppNavbar />

      <div className="max-w-6xl mx-auto">
        <div>
          <div className="py-8 max-w-5xl mx-8">
            <div className="font-black text-6xl lg:text-7xl font-serif select-none">
              Envoyer votre vidéo lourde sur Messenger par ici.
            </div>
            <article className="text-gray-500 font-semibold mt-4 text-sm lg:text-base">
              Uploader votre vidéo et vous recevrez un lien de recupération.
            </article>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 px-8">
          <div>
            <p className="leading-noose lg:mt-8 text-base lg:text-lg">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi
              consectetur minima laboriosam natus laudantium totam placeat,
              inventore qui voluptates reprehenderit.
            </p>
            <div className="my-4">
              <Link to="/upload" className="btn btn-neutral">
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
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                  />
                </svg>
                <span> Uploader</span>
              </Link>
            </div>
          </div>
          <div className="max-w-3xl mx-auto ">
            <div className="mockup-browser bg-white border-base-300 border shadow-md">
              <div className="mockup-browser-toolbar">
                <div className="input  border-base-300 border">
                  website demo
                </div>
              </div>
              <div className="border-base-300 border-t flex justify-center px-4 py-16">
                <img
                  src={DemoImg}
                  alt="preview"
                  className="transition-all duration-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
