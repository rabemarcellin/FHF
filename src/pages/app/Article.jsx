import React, { useEffect, useMemo, useRef, useState } from "react";
import AppNavbar from "../../components/AppNavbar";
import { newArticleService } from "../../services/article";
import { useDispatch, useSelector } from "react-redux";
import { selectAllArticles } from "../../store/article/selector";
import {
  createNewArticleAction,
  getArticlesAction,
} from "../../store/article/action";
import ImgCrossOrigin from "../../components/ImgCrossOrigin";
import { Link } from "react-router-dom/dist";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { getUserLogged } from "../../services/auth";
import ArticleCard from "../../components/ArticleCard";

const Article = () => {
  const articles = useSelector(selectAllArticles);
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(getArticlesAction());
  }, []);

  const filteredArticles = useMemo(() => {
    if (searchKey.trim().length === 0) {
      return articles;
    }

    const isArticleTitle = (article) =>
      article?.title?.toLowerCase().includes(searchKey.toLowerCase());
    const isArticleDesc = (article) =>
      article.desc.toLowerCase().includes(searchKey.toLowerCase());
    return articles.filter(
      (article) => isArticleDesc(article) || isArticleTitle(article)
    );
  }, [searchKey, articles]);
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <div className="flex-none">
        <AppNavbar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b">
          <div className="max-w-4xl mx-auto w-full pb-2 md:pb-4 px-4">
            <div className="flex-none sm:flex justify-end my-2">
              <button
                className="btn btn-primary w-full sm:w-fit m-1 px-4 min-h-0 h-8 md:h-10 md:text-sm text-xs"
                onClick={() =>
                  document.getElementById("create-article").showModal()
                }
              >
                Nouveau article
              </button>
            </div>
            <div className="flex-none border rounded-3xl overflow-hidden flex gap-2 bg-slate-100 items-center">
              <span className="px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 lg:size-6"
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
                className="w-full h-full p-2 lg:p-4 bg-slate-100 outline-none text-xs lg:text-sm"
                placeholder="Recherche un titre d'un article"
                value={searchKey}
                onChange={(event) => setSearchKey(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-300">
          <div className="">
            <div className="max-w-4xl mx-auto p-8 lg:p-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:justify-between gap-4">
                {filteredArticles &&
                  filteredArticles.length > 0 &&
                  filteredArticles
                    .filter((each) => each.id)
                    .map((eachArticle) => (
                      <ArticleCard article={eachArticle} />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
