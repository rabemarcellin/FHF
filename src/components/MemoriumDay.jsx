import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { convertDate } from "../helpers/date-utils";
import AppNavbar from "./AppNavbar";
import { daysOfWeek, months } from "../datas/date";
import { useDispatch, useSelector } from "react-redux";
import { getArticlesByDateAction } from "../store/article/action";
import { selectAllArticles } from "../store/article/selector";
import { Link } from "react-router-dom";
import ArticleForm from "./ArticleForm";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ArticlePostCard from "./ArticlePostCard";

const MemoriumDay = () => {
  const { date } = useParams();
  const currentDate = useMemo(() => convertDate(date), [date]);
  const articles = useSelector(selectAllArticles);
  const dispatch = useDispatch();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  useEffect(() => {
    setIsFetchLoading(true);
    dispatch(
      getArticlesByDateAction({
        date: currentDate.day,
        month: currentDate.month,
        year: currentDate.year,
      })
    ).finally(() => setIsFetchLoading(false));
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
                  {isFetchLoading ? (
                    <SkeletonTheme baseColor="#e2e8f0">
                      <div>
                        <Skeleton height={40} />
                        <Skeleton height={100} />
                      </div>
                      <div>
                        <Skeleton height={40} />
                        <Skeleton height={100} />
                      </div>
                    </SkeletonTheme>
                  ) : (
                    articles.length > 0 &&
                    articles
                      .filter((article) => article.title)
                      .map((article) => (
                        <ArticlePostCard date={date} article={article} />
                      ))
                  )}

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
        eventDate={{
          day: currentDate.day,
          month: currentDate.month - 1,
          year: currentDate.year,
        }}
      />
    </div>
  );
};

export default MemoriumDay;
