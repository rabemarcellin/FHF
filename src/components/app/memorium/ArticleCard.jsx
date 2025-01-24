import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImgCrossOrigin from "../../ui/ImgCrossOrigin";

const ArticleCard = ({ article }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <Link
      to={`/article/${article.id}`}
      className="article--item bg-white overflow-hidden"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={`h-40 border-b w-full shadow-md${
          isHover ? " " + "scale-105" : ""
        } transition duration-300 ease-in-out`}
      >
        <ImgCrossOrigin
          src={article.pictures[0]}
          alt=""
          className={"w-full h-full object-cover rounded-t-md"}
        />
      </div>

      <div className="p-2 mt-4">
        <h1 className="title mb-2 text-center rounded-md">{article.title}</h1>
      </div>
    </Link>
  );
};

export default ArticleCard;
