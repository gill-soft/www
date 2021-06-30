import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messanges } from "../intl/NavMessanges";
import s from "./AgentPage.module.css";
import LoginPage from "../components/AgentPageContainer/Login";
import AgentDashboard from '../components/AgentPageContainer/AgentDashboard'

const AgentPage = () => {
  const [isAgent, setIsAgent] = useState(false);
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

  useEffect(() => {
    const agent = JSON.parse(localStorage.getItem("auth"));
    if (agent) setIsAgent(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("auth")]);

  return (
    <IntlProvider locale={locale} messages={messanges[locale]}>
      <div className={s.container}>
        {!isAgent ? <LoginPage  /> : <AgentDashboard />}
      </div>
    </IntlProvider>
  );
};
export default AgentPage;
