import React from "react";
import AppNavbar from "../../components/AppNavbar";

const Article = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <div className="flex-none">
        <AppNavbar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b">
          <div className="max-w-4xl mx-auto w-full p-4">
            <div className="flex-none flex justify-end my-4">
              <button className="btn btn-primary">Nouveau article</button>
            </div>
            <div className="flex-none border rounded-3xl overflow-hidden flex gap-2 bg-slate-100 items-center">
              <span className="px-4">
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </span>
              <input
                type="text"
                className="w-full h-full p-4 bg-slate-100 outline-none"
                placeholder="Recherche un titre d'un article"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="h-screen">
            <div className="max-w-4xl mx-auto p-8 lg:p-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:justify-between gap-2">
                <div className="article--item">
                  <h1 className="title">Titre de l'article</h1>
                </div>
                <div className="article--item">
                  <h1 className="title">Titre de l'article</h1>
                </div>
                <div className="article--item">
                  <h1 className=" title">Titre de l'article</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
