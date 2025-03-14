import React from "react";
import AppNavbar from "../../components/ui/AppNavbar";
import CashTrack from "./CashTrack";

const Dashboard = () => {
  return (
    <div>
      <AppNavbar />
      <div className="max-w-4xl mx-auto">
        <CashTrack />
      </div>
    </div>
  );
};

export default Dashboard;
