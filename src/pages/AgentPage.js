import React from "react";
import { Redirect } from "react-router-dom";
import LoginPage from "../components/AgentPageContainer/Login";
// import AgentDashboard from "../components/AgentPageContainer/AgentDashboard";

const AgentPage = () => {
  const isAgent = JSON.parse(localStorage.getItem("auth"));
  console.log(isAgent?.type !== "CLIENT");
  return (
    <div>
      {isAgent?.type !== "CLIENT" && <LoginPage />}
      {!isAgent && <LoginPage />}
      {isAgent && <Redirect to="/cabinet" />}
    </div>
  );
};
export default AgentPage;
