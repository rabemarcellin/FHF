import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { checkUserLogStatus } from "../../helpers/utils";
import { getUserLogged } from "../../services/auth";

export default function AppNavbar() {
  const [user, setUser] = useState(null);
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
  const isUserLogged = checkUserLogStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLogged) {
      const getUser = async () => {
        const user = await getUserLogged();
        if (user === "KO") {
          navigate("/logout");
        } else {
          setUser(user);
        }
      };
      getUser();
    }
  }, [localStorage.getItem("token"), localStorage.getItem("refresh-token")]);

  const isAdmin = useMemo(() => {
    if (user && user.role) {
      return user.role === "admin";
    }
    return false;
  }, [user]);

  return (
    <div className="z-20 navbar bg-white border-b sticky top-0 min-h-0 h-[50px] lg:h-[60px]">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl font-black">
          FHF
        </Link>
      </div>
      <div className="navbar-end">
        {/* mobile view */}
        <div className="lg:hidden">
          <button
            className="flex items-center justify-center rounded-full h-8 w-8 btn p-1 min-h-0"
            onClick={() => setOpenMobileMenu(true)}
          >
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {openMobileMenu && (
            <div className="absolute top-0 left-0 w-screen h-screen z-20 bg-black/90 flex flex-col">
              <div className="flex-none flex justify-end">
                <button
                  className="bg-black/75 w-10 h-10 flex items-center justify-center rounded-full m-2"
                  onClick={() => {
                    setOpenMobileMenu(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10 text-white "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <ul className="navbar-responsive__menu text-sm">
                  {user ? (
                    <>
                      {/*  <li className="mx-4 font-semibold text-gray-500 hover:text-black hover:font-bold cursor-pointer">
                  <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
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
                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                      </svg>

                      <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                  </button>
                </li> */}

                      <li>
                        <NavLink to="/dashboard" className=" menu-item ">
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/memorium" className="menu-item">
                          Memorium
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/upload" className="menu-item">
                          Vidéo vers Messenger
                        </NavLink>
                      </li>

                      <li className="flex-1 flex flex-col justify-end mb-4 items-center">
                        <details className="dropdown">
                          <summary className="flex items-center gap-2 cursor-pointer select-none">
                            <span className="bg-gray-500 hover:bg-gray-200 transition duration-300 active:scale-95 ease-in-out w-10 h-10 flex items-center justify-center  rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 stroke-2 fill-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                />
                              </svg>
                            </span>
                            <span>{user.userName}</span>
                          </summary>
                          <ul className="menu dropdown-content rounded-box z-[1] min-w-52 p-2 shadow -translate-y-36 bg-black">
                            <li>
                              <Link
                                to="/settings"
                                className=" hover:bg-white/10"
                              >
                                Paramètres
                              </Link>
                            </li>
                            <li>
                              <Link to="/logout" className="hover:bg-white/10">
                                Déconnexion
                              </Link>
                            </li>
                          </ul>
                        </details>
                      </li>
                    </>
                  ) : (
                    <>
                      {" "}
                      <li className="m-4 flex-1 flex flex-col justify-end items-center">
                        <Link
                          to="/login"
                          className="btn btn-primary text-white text-base w-full"
                        >
                          Connexion
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* large screen */}
        <div className="hidden lg:block">
          <ul className="flex gap-4 items-center mx-4 text-sm">
            {user ? (
              <>
                {/*  <li className="mx-4 font-semibold text-gray-500 hover:text-black hover:font-bold cursor-pointer">
                  <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
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
                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                      </svg>

                      <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                  </button>
                </li> */}

                <li>
                  <NavLink
                    to="/dashboard"
                    className="mx-4 font-semibold text-gray-500 hover:text-black hover:font-bold hover:underline cursor-pointer"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/memorium"
                    className="mx-4 font-semibold text-gray-500 hover:text-black hover:font-bold hover:underline cursor-pointer"
                  >
                    Memorium
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/upload"
                    className="mx-4 font-semibold text-gray-500 hover:text-black hover:font-bold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Vidéo vers Messenger
                  </NavLink>
                </li>

                <li>
                  <details className="dropdown">
                    <summary className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="bg-gray-500 hover:bg-gray-200 transition duration-300 active:scale-95 ease-in-out w-10 h-10 flex items-center justify-center  rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 stroke-2 fill-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </span>
                      <span>{user.userName}</span>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] min-w-52 p-2 shadow -translate-x-10">
                      <li>
                        <Link to="/setting" className="text-end">
                          Paramètres
                        </Link>
                      </li>
                      <li>
                        <Link to="/logout">Déconnexion</Link>
                      </li>
                    </ul>
                  </details>
                </li>
              </>
            ) : (
              <>
                {" "}
                <li className="mx-4">
                  <Link
                    to="/login"
                    className="btn btn-primary text-white text-base"
                  >
                    Connexion
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
