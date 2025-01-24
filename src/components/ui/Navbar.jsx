import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-end p-4">
      <nav>
        <ul className="flex gap-4 items-center">
          <li>
            <Link
              to="/login"
              className="bg-white  font-bold p-2 border-2 border-gray-700 hover:bg-green-400 active:bg-green-500"
            >
              connexion
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
