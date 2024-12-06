import React from "react";
import { Outlet } from "react-router-dom";
import AppContextProvider from "../contexts/AppContextProvider";

export default function Root() {
  return (
    <AppContextProvider>
      <Outlet />
    </AppContextProvider>
  );
}
