import React, { useEffect } from "react";
import AppNavbar from "../../components/AppNavbar";
import { Link, useNavigate } from "react-router-dom";
import { checkUserLogStatus } from "../../helpers/utils";
import { getUserLogged } from "../../services/auth";

export default function Landing() {
  const navigate = useNavigate();
  const isUserLogged = checkUserLogStatus();
  useEffect(() => {
    const checkUserExists = async () => {
      const usersId = await getUserLogged();
      if (usersId === "KO") {
        navigate("/logout");
      } else {
        navigate("/dashboard");
      }
    };
    if (isUserLogged) {
      checkUserExists();
    }
  }, []);

  return (
    <div className=" pb-8">
      <AppNavbar />

      <div className="max-w-6xl mx-auto">
        <div>
          <div className="py-8 max-w-5xl mx-8">
            <div className="font-black text-5xl md:text-6xl lg:text-7xl font-seri select-none">
              Envoyer votre vidéo lourde sur Messenger par ici.
            </div>
            <article className="text-gray-500 font-semibold mt-4 text-xs lg:text-sm">
              Uploader votre vidéo et vous recevrez un lien de recupération.
            </article>
            <div className="my-4">
              <Link to="/login" className="btn btn-neutral">
                <span>Commencer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
