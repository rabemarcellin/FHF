import { useState, useEffect } from "react";
import { checkUserLogStatus } from "../helpers/utils";
import { getUserLogged } from "../services/auth";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isUserLogged = checkUserLogStatus();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkUserExists = async () => {
      const usersId = await getUserLogged();
      if (usersId === "KO") {
        console.log("logout");
        navigate("/logout");
      } else {
        console.log("usersId", usersId);
      }
    }; // if app store tokens, verify thewe token by fetching the user info

    if (isUserLogged) {
      checkUserExists();
    } else {
      navigate("/");
    }

    setIsVerifying(false);
  }, [localStorage.getItem("token"), localStorage.getItem("refresh-token")]);

  return isVerifying ? (
    <div className="flex justify-center items-center gap-4 w-screen h-screen ">
      <span>Chargement</span>
      <span className="loading loading-spinner loading-xs"></span>
    </div>
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
