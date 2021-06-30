import React, { useState, useEffect } from "react";
import LoginPage from "../components/AgentPageContainer/Login";
import AgentDashboard from "../components/AgentPageContainer/AgentDashboard";

const AgentPage = () => {
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    const agent = JSON.parse(localStorage.getItem("auth"));
    if (agent) setIsAgent(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("auth")]);

  return <div>{!isAgent ? <LoginPage /> : <AgentDashboard />}</div>;
};
export default AgentPage;
