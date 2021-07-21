import React from "react";
import { Redirect } from "react-router-dom";
import LoginPage from "../components/AgentPageContainer/Login";
// import AgentDashboard from "../components/AgentPageContainer/AgentDashboard";

const AgentPage = () => {
  const isAgent = JSON.parse(localStorage.getItem("auth"));

  if (!isAgent) return <LoginPage />;
  if (isAgent?.type === "CLIENT") return <LoginPage />;

  return (
    <div>
      <Redirect to="/cabinet" /> 
    </div>
  );
};
export default AgentPage;
