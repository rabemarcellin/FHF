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

const Article = () => {
  const pictureFormRef = useRef();
  const [pictures, setPictures] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const articles = useSelector(selectAllArticles);
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState("");

  const openPictureLocal = () => {
    if (pictureFormRef.current) pictureFormRef.current.click();
  };

  const getLocalPictures = (event) => {
    setPictures(Array.from(event.target.files));
  };

  const createNewArticle = async (event) => {
    setIsProcessing(true);
    event.preventDefault();

    console.log(eventDate);
    if (name && desc && pictures && eventDate) {
      await dispatch(
        createNewArticleAction({ title: name, desc, pictures, eventDate })
      );
    }
    setIsProcessing(false);
    document.getElementById("create-article").close();
  };

  const removeOnePicture = (name) => {
    setPictures((lastState) => lastState.filter((each) => each.name !== name));
  };

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

        <div className="flex-1 overflow-auto bg-slate-100">
          <div className="">
            <div className="max-w-4xl mx-auto p-8 lg:p-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:justify-between gap-2">
                {filteredArticles &&
                  filteredArticles.length > 0 &&
                  filteredArticles
                    .filter((each) => each.id)
                    .map((eachArticle) => (
                      <Link
                        to={`/article/${eachArticle.id}`}
                        className="article--item bg-white overflow-hidden"
                      >
                        <div className="h-40 border w-full ">
                          <ImgCrossOrigin
                            src={eachArticle.pictures[0]}
                            alt=""
                            className={
                              "w-full h-full object-cover rounded-t-md"
                            }
                          />
                        </div>

                        <div className="p-2">
                          <h1 className="title mb-2 text-center rounded-md">
                            {eachArticle.title}
                          </h1>

                          <div className="line-clamp-3 text-xs lg:text-sm text-gray-500">
                            {eachArticle.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <dialog id="create-article" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Nouveau Article</h3>

          <form onSubmit={createNewArticle}>
            <div className="py-4">
              <section className="mb-4">
                <div>
                  <label
                    htmlFor="article-title"
                    className="font-bold text-xs lg:text-sm"
                  >
                    Date de l'évènement
                  </label>
                </div>
                <div className=" overflow-x-hidden overflow-y-hidden  ">
                  {" "}
                  <DatePicker
                    selected={eventDate}
                    onChange={(date) => setEventDate(date)}
                    className="p-2 outline-none focus:border-gray-500 border rounded-md border-b-4 transition duration-300 ease-in-out w-full"
                  />
                </div>
              </section>
              <section className="mb-4">
                <div>
                  <label
                    htmlFor="article-title"
                    className="font-bold text-xs lg:text-sm"
                  >
                    Titre
                  </label>
                </div>
                <div className=" overflow-x-hidden overflow-y-hidden  ">
                  {" "}
                  <input
                    type="text"
                    name=""
                    id="article-title"
                    placeholder="titre de l'article"
                    value={name}
                    required
                    onChange={(event) => setName(event.target.value)}
                    className="p-2 outline-none focus:border-gray-500 border rounded-md border-b-4 transition duration-300 ease-in-out w-full"
                  />
                </div>
              </section>
              <section className="mb-4">
                <div>
                  <label
                    htmlFor="article-desc"
                    className="font-bold text-xs lg:text-sm"
                  >
                    Description
                  </label>
                </div>
                <div className=" overflow-x-hidden overflow-y-hidden  ">
                  {" "}
                  <textarea
                    name=""
                    id="article-desc"
                    placeholder="description"
                    value={desc}
                    required
                    onChange={(event) => setDesc(event.target.value)}
                    className="p-2 outline-none focus:border-gray-500 border rounded-md border-b-4 transition duration-300 ease-in-out w-full"
                  ></textarea>
                </div>
              </section>

              <section>
                <div>
                  <label htmlFor="" className="font-bold text-xs lg:text-sm">
                    Pictures
                  </label>
                </div>

                <div className="p-2 cursor-pointer w-full bg-white rounded-md shadow-lg">
                  <div
                    className="flex justify-center items-center  border-dashed p-1  border-4"
                    onClick={openPictureLocal}
                  >
                    <section className="w-full flex gap-2 items-center justify-center">
                      <div className="flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={`size-4`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                          />
                        </svg>
                      </div>
                      <div className="flex justify-center max-w-lg overflow-x-hidden items-center my-2 text-xs lg:text-sm">
                        Cliquer ici pour téléverser un fichier
                      </div>
                    </section>

                    <input
                      ref={pictureFormRef}
                      type="file"
                      name="bank"
                      accept="image/*"
                      onChange={getLocalPictures}
                      multiple
                      hidden
                    />
                  </div>
                </div>
              </section>

              {pictures.length > 0 && (
                <section className="mb-4 max-h-40 overflow-auto">
                  {pictures.map((picture) => (
                    <div className="m-2 border-b rounded-md flex items-center gap-4">
                      <span>
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
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      </span>
                      <span className="flex-1">{picture.name}</span>
                      <button onClick={() => removeOnePicture(picture.name)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 fill-red"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </section>
              )}
            </div>
            <div className="modal-action">
              <div className="flex gap-4">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-ghost">Annuler</button>
                </form>
                <button
                  className="btn btn-primary w-28"
                  onClick={createNewArticle}
                >
                  {isProcessing ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Article;
