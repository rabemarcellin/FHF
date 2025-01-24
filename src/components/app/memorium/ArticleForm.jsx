import React, { useRef, useState } from "react";
import { getUserLogged } from "../../../services/auth";
import { createNewArticleAction } from "../../../store/article/action";
import { useDispatch } from "react-redux";

const ArticleForm = ({ eventDate }) => {
  const dispatch = useDispatch();

  const pictureFormRef = useRef();
  const [pictures, setPictures] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  /*   const [eventDate, setEventDate] = useState(new Date());
   */ const [isProcessing, setIsProcessing] = useState(false);

  const openPictureLocal = () => {
    if (pictureFormRef.current) pictureFormRef.current.click();
  };

  const getLocalPictures = (event) => {
    setPictures(Array.from(event.target.files));
  };

  const createNewArticle = async (event) => {
    setIsProcessing(true);
    event.preventDefault();

    if (name && desc && pictures) {
      const userLogged = await getUserLogged();
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();

      await dispatch(
        createNewArticleAction({
          title: name,
          desc,
          pictures,
          eventDate: new Date(
            eventDate.year,
            eventDate.month,
            eventDate.day,
            currentHours,
            currentMinutes
          ),
          userId: userLogged.id,
        })
      );
    }
    setIsProcessing(false);
    document.getElementById("create-article").close();
  };

  const removeOnePicture = (name) => {
    setPictures((lastState) => lastState.filter((each) => each.name !== name));
  };

  return (
    <dialog id="create-article" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Nouveau Article</h3>

        <form onSubmit={createNewArticle}>
          <div className="py-4">
            {/* <section className="mb-4">
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
              </section> */}
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
  );
};

export default ArticleForm;
