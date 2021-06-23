import React from "react";
import { useSelector } from "react-redux";

import { IntlProvider, FormattedMessage } from "react-intl";
import { messanges } from "../../intl/NavMessanges";
import { ReactComponent as Search } from "../../images/search.svg";
import styles from "./Agent.module.css";

const Agent = ({ agent, handleExit }) => {
    const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  return (
    <IntlProvider locale={locale} messages={messanges[locale]}>
      <div className={styles.agentBox}>
        <p>
          <FormattedMessage id="login" />
          <span> {agent.clientName || agent.login}</span>
        </p>
        <div className={styles.search}>
          <Search fill="var(--color-secondary)" />
        </div>
        <button onClick={handleExit}><FormattedMessage id="exit" /></button>
      </div>
    </IntlProvider>
  );
};

export default Agent;
