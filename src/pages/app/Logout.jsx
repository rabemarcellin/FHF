import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const logoutUserOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh-token");
    setTimeout(() => {
      navigate("/");
    }, [200]);
  };

  useEffect(() => {
    logoutUserOut();
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center gap-4">
      <span>Déconnexion en cours </span>{" "}
      <span className="loading loading-spinner loading-xs"></span>
    </div>
  );
};

export default Logout;
