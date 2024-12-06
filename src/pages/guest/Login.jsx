import React, { useState } from "react";
import AuthIllustrationImg from "../../assets/img/auth-illustration.png";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth";

export default function Login() {
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginForm = async (event) => {
    event.preventDefault();

    if (userName.length > 0 && password.length > 0) {
      try {
        await loginService(userName, password);
        navigate("/dashboard");
      } catch (error) {
        console.error("error login service: ", error);
        // update view
      }
    }
  };
  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="grid lg:grid-cols-2 gap-4 h-full">
        <div className="absolute top-0 left-0 h-screen overflow-hidden lg:static">
          <img src={AuthIllustrationImg} alt="auth" className="cover-img" />
        </div>
        <div className="">
          <div className="p-4 pb-0 lg:pb-4 h-[80%] lg:h-full absolute lg:static top-[20%] w-full mx-auto">
            <div className="bg-gradient-to-r from-[#e3ffe7] to-[#d9e7ff] h-full rounded-badge rounded-b-none lg:rounded-xl flex flex-col justify-center items-center">
              <div className="w-full p-4 self-start ">
                <Link to="/" className="flex items-center gap-4">
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
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>

                  <span className="font-mono">VideoUpload</span>
                </Link>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <form action="" className="" onSubmit={loginForm}>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Identifiant</span>
                    </div>
                    <input
                      type="text"
                      placeholder="rabemarcellin"
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                    />
                    <div className="label">
                      {/*  <span className="label-text-alt">En cas d'erreur</span> */}
                    </div>
                  </label>

                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Mot de passe</span>
                    </div>
                    <input
                      type="password"
                      placeholder="*********"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                    />
                    {isError && (
                      <div className="label">
                        <span className="label-text-alt font-bold text-red-900">
                          En cas d'erreur
                        </span>
                      </div>
                    )}
                  </label>

                  <div className="my-4">
                    <button className="btn btn-neutral rounded-badge w-80">
                      Connexion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
