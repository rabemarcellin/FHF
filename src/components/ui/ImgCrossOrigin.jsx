import React from "react";

const ImgCrossOrigin = ({ src, alt, className }) => {
  return (
    <img src={src} alt={alt} crossOrigin="anonymous" className={className} />
  );
};

export default ImgCrossOrigin;
