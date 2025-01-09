import React, { useEffect, useMemo, useState } from "react";
import { getOneArticleService } from "../services/article";
import { Link, useLoaderData, useNavigate } from "react-router-dom/dist";
import AppNavbar from "./AppNavbar";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import ArticlePicture from "./ArticlePicture";
import { getUserLogged } from "../services/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export async function loader({ params }) {
  const articleId = params.id;
  const article = await getOneArticleService(articleId);
  return article;
}

const ArticleDetails = () => {
  const article = useLoaderData();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [writeMode, setWriteMode] = useState(false);
  const [titleTemp, setTitleTemp] = useState("");
  const [descTemp, setDescTemp] = useState("");
  const [eventDateTemp, setEventDateTemp] = useState(new Date());

  useEffect(() => {
    document.title = article.title;
    (async () => {
      const userLogged = await getUserLogged();
      setUser(userLogged);
    })();
  }, []);

  const haveChangePermission = useMemo(() => {
    if (article && user) {
      return (
        article.userId && user.role === "admin" && user.id == article.userId
      );
    }
    return false;
  }, [user, article]);

  const eventDate = useMemo(() => {
    const date = new Date(article.eventDate).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return date === "Invalid Date" ? null : date;
  }, [article]);

  useEffect(() => {
    setTitleTemp(article.title);
    setDescTemp(article.desc);
    if (article.eventDate) {
      setEventDateTemp(new Date(article.eventDate));
    }
  }, [article]);

  return (
    <div>
      <AppNavbar />
      <div className="p-4 max-w-3xl mx-auto">
        {eventDate && (
          <div className="flex gap-2 items-center justify-center text-xs mb-4 border-b w-fit mx-auto">
            <div>
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
            </div>
            {writeMode ? (
              <DatePicker
                selected={eventDateTemp}
                onChange={(date) => setEventDateTemp(date)}
                className="p-2 outline-none focus:border-gray-500 border rounded-md border-b-4 transition duration-300 ease-in-out w-full"
              />
            ) : (
              <div className="text-gray-500">{eventDate}</div>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <button
            data-tip="Retour vers la liste des articles"
            onClick={() => {
              navigate(-1);
            }}
            className="flex-none tooltip tooltip-right before:text-xs lg:before:text-sm  bg-slate-100 w-8  h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition duration-300"
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          {haveChangePermission && (
            <textarea
              className=" font-black text-5xl lg:text-7xl leading-10 text-center outline-none disabled:bg-transparent"
              value={titleTemp}
              onChange={(event) => setTitleTemp(event.target.value)}
              disabled={!writeMode}
            ></textarea>
          )}

          {user &&
            article.userId &&
            user.role === "admin" &&
            user.id == article.userId &&
            (writeMode ? (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 hover:stroke-1 cursor-pointer"
                  onClick={() => setWriteMode(false)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
            ) : (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 hover:stroke-1 cursor-pointer"
                  onClick={() => setWriteMode(true)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </div>
            ))}
        </div>

        {!haveChangePermission && (
          <div className="text-5xl lg:text-7xl leading-10 text-center py-6 pb-lg:py-4">
            {article.title}
          </div>
        )}

        <div className="py-5 border-b text-sm lg:text-base">
          <textarea
            value={descTemp}
            onChange={(e) => setDescTemp(e.target.value)}
            className="leading-loose w-full outline-none disabled:bg-transparent"
            disabled={!writeMode}
          ></textarea>
        </div>

        <div className="mt-4">
          <div className="flex-1">
            <ResponsiveMasonry columnsCountBreakPoints={{ 576: 2, 768: 3 }}>
              <Masonry gutter={10}>
                {article.pictures.map((src) => (
                  <ArticlePicture src={src} title={article.title} />
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default ArticleDetails;
