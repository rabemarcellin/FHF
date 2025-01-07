import React, { useEffect, useMemo } from "react";
import { getOneArticleService } from "../services/article";
import { Link, useLoaderData } from "react-router-dom/dist";
import AppNavbar from "./AppNavbar";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import ArticlePicture from "./ArticlePicture";

export async function loader({ params }) {
  const articleId = params.id;
  const article = await getOneArticleService(articleId);
  return article;
}
const ArticleDetails = () => {
  const article = useLoaderData();

  useEffect(() => {
    document.title = article.title;
  }, []);

  const eventDate = useMemo(() => {
    const date = new Date(article.eventDate).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return date === "Invalid Date" ? null : date;
  }, [article]);

  return (
    <div>
      <AppNavbar />
      <div className="p-4 max-w-3xl mx-auto">
        <Link
          data-tip="Retour vers la liste des articles"
          to="/article"
          className="tooltip tooltip-right before:text-xs lg:before:text-sm  bg-slate-100 w-8 lg:w-12 h-8 lg:h-12 rounded-full flex items-center justify-center hover:bg-slate-200 transition duration-300"
        >
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <div
          className=" font-bold font-title text-5xl lg:text-7xl leading-10
         lg:leading-snug text-center py-6 pb-lg:py-4"
        >
          {article.title}
        </div>
        {eventDate && (
          <div className="flex gap-2 items-center justify-center text-xs lg:text-sm">
            <div>
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
            </div>
            <div className="text-gray-500">{eventDate}</div>
          </div>
        )}

        <div className="py-5 border-b text-base lg:text-lg">
          <p className="leading-loose">{article.desc}</p>
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
