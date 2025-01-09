import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { convertDate } from "../helpers/date-utils";
import AppNavbar from "./AppNavbar";
import { daysOfWeek, months } from "../datas/date";
import { useDispatch, useSelector } from "react-redux";
import { getArticlesAction } from "../store/article/action";
import {
  selectAllArticles,
  selectArticlesByDate,
} from "../store/article/selector";
import { Link } from "react-router-dom";
import ArticleForm from "./ArticleForm";

const MemoriumDay = () => {
  const { date } = useParams();

  const currentDate = useMemo(() => convertDate(date), [date]);
  const articles = useSelector((state) => {
    if (!currentDate) {
      return [];
    }
    const activeDate = new Date(
      currentDate.year,
      currentDate.month - 1,
      currentDate.day
    );
    console.log(activeDate);
    return selectArticlesByDate(state, activeDate);
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getArticlesAction());
  }, []);

  return (
    <div className="flex flex-col h-screen relative">
      <div className="flex-none">
        <AppNavbar />
      </div>
      {currentDate ? (
        <div className="flex-1 w-full h-full overflow-hidden lg:overflow-auto bg-slate-100">
          <div className="flex flex-col lg:flex-row h-full lg:py-4 ">
            <div className="w-40 hidden lg:block">
              <div className="p-2 flex-none fixed flex justify-center">
                <div className="bg-primary text-white w-32 h-20  px-4 flex flex-col relative justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-full after:-z-10 after:translate-x-2 after:translate-y-2 after:shadow-md after:border-2 after:border-slate-400 after:bg-white">
                  {
                    daysOfWeek[
                      new Date(
                        currentDate.year,
                        currentDate.month - 1,
                        currentDate.day
                      ).getDay()
                    ]
                  }
                  <div className="text-x font-black">
                    {currentDate.day.toString().padStart(2, "0")}/
                    {currentDate.month.toString().padStart(2, "0")}/
                    {currentDate.year}
                  </div>
                </div>
              </div>
            </div>
            <div className=" bg-white border-b lg:hidden">
              <div className="w-40">
                <div className="p-2 flex-none flex justify-center">
                  <div className="bg-primary rounded-lg text-white w-32 h-14 lg:h-20  px-4 flex flex-col relative justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-full after:-z-10 after:translate-x-2 after:translate-y-2 after:shadow-md after:border-2 after:border-slate-400 after:bg-white">
                    {
                      daysOfWeek[
                        new Date(
                          currentDate.year,
                          currentDate.month - 1,
                          currentDate.day
                        ).getDay()
                      ]
                    }
                    <div className="text-x font-black">
                      {currentDate.day.toString().padStart(2, "0")}/
                      {currentDate.month.toString().padStart(2, "0")}/
                      {currentDate.year}
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="grid gap-8 max-w-sm mx-auto">
                  {articles.length > 0 &&
                    articles
                      .filter((article) => article.title)
                      .map((article) => (
                        <div
                          onClick={() =>
                            navigate(`/memorium/${date}/${article.id}`)
                          }
                          className="p-2 cursor-pointer bg-white border-slate-200 shadow rounded-md hover:shadow-lg transition duration-300"
                        >
                          <h1 className="font-bold text-center border-b">
                            {article.title}
                          </h1>
                          <p className="mt-2 leading-loose text-gray-500 text-xs">
                            {article.desc}
                          </p>
                          <article className="mt-4 flex gap-4 items-center">
                            <div className="flex gap-1 text-xs items-center">
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
                                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                              </svg>
                              <span className="font-bold">
                                {article.pictures.length}
                              </span>
                            </div>
                            <div className="w-fit px-2 p-px text-xs font-bold bg-primary/70 text-white rounded-xl">
                              #tag
                            </div>
                          </article>
                        </div>
                      ))}

                  <div className="sticky bottom-0 transition-all duration-500 ease-in-out">
                    <div
                      onClick={() =>
                        document.getElementById("create-article").showModal()
                      }
                      className="text-white p-2 w-12 h-12 mx-auto m-2 rounded-full bg-neutral flex justify-center items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2 items-center justify-center">
          <div>Date non reconnue</div>

          <div className="text-xs text-gray-500">
            Retour au{" "}
            <Link
              to="/memorium"
              className="underline text-gray-700 italic font-medium"
            >
              memorium
            </Link>
            .
          </div>
        </div>
      )}

      <ArticleForm
        eventDate={
          new Date(currentDate.year, currentDate.month - 1, currentDate.day)
        }
      />
    </div>
  );
};

export default MemoriumDay;
