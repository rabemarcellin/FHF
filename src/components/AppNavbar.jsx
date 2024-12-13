import React from "react";
import { Link } from "react-router-dom";

export default function AppNavbar() {
  const isAdmin = false;
  return (
    <div className="z-20 navbar bg-white border-b sticky top-0 min-h-0 h-[50px] lg:h-[60px]">
      <div className="navbar-start" />
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-xl font-black">
          FHF
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle min-h-0 h-8 w-8 lg:h-10 lg:w-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 lg:h-5 lg:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/login" className="btn font-bold">
                Connexion
              </Link>
            </li>
          </ul>
        </div>
        {isAdmin && (
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
        )}
      </div>
    </div>
  );
}
