import React, { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "@material-ui/core/Modal";

import { IntlProvider, FormattedMessage } from "react-intl";
import { messanges } from "../../intl/NavMessanges";
import { ReactComponent as Search } from "../../images/search.svg";
import styles from "./Agent.module.css";
import Nav from "../Nav/Nav";
import AgentSearch from "../AgentSearch/AgentSearch";

const Agent = ({ agent, handleExit }) => {
  const [isModal, setIsModal] = useState(false);
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  const handleClose = () => {
    setIsModal(false)
  }
  return (
    <IntlProvider locale={locale} messages={messanges[locale]}>
      <div className={styles.agentBox}>
        <p>
          <FormattedMessage id="login" />
          <span> {agent.clientName || agent.login}</span>
        </p>
        <div className={styles.search}>
          <Search fill="var(--color-secondary)" onClick={() => setIsModal(true)} />
        </div>
        <button onClick={handleExit}>
          <FormattedMessage id="exit" />
        </button>
      </div>
      <Modal open={isModal} onClose={() => setIsModal(false)}>
        <AgentSearch close={handleClose} />
      </Modal>
    </IntlProvider>
  );
};

export default Agent;
