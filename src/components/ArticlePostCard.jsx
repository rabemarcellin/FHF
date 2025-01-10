import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByIdService } from "../services/user";

const ArticlePostCard = ({ date, article }) => {
  const navigate = useNavigate();

  const [userPosted, setUserPosted] = useState(null);

  useEffect(() => {
    if (article.userId) {
      getUserByIdService(article.userId).then((user) => setUserPosted(user));
    }
  }, [article]);

  return (
    userPosted && (
      <div
        onClick={() => navigate(`/memorium/${date}/${article.id}`)}
        className="p-2 cursor-pointer bg-white border-slate-200 shadow rounded-md hover:shadow-lg transition duration-300"
      >
        <div className="flex items-center text-xs gap-2 border-b pb-2">
          <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
          <div>{userPosted.userName}</div>
        </div>
        <h1 className="font-bold text-center border-b">{article.title}</h1>
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
            <span className="font-bold">{article.pictures.length}</span>
          </div>
          <div className="w-fit px-2 p-px text-xs font-bold bg-primary/70 text-white rounded-xl">
            #tag
          </div>
        </article>
      </div>
    )
  );
};

export default ArticlePostCard;
