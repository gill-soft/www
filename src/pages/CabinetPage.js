import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import styles from "./CabinenPage.module.css";

import { IntlProvider, FormattedMessage } from "react-intl";
// import { messages } from "../intl/AgentPageMessage";
import { getLang } from "../redux/Language/LanguageSelectors";
import { getWallet } from "../services/api";
import Wallet from "../components/CabinetContainer/Wallet";
import SearchBox from "../components/CabinetContainer/SearchBox";

const CabinetPage = () => {
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const [wallet, setWallet] = useState(null);
  const getWalletInfo = useCallback(async () => {
    try {
      const { data } = await getWallet();
      console.log(data);
      setWallet(data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getWalletInfo();
  }, [getWalletInfo]);
  return (
    <div className="container">
      <div className={styles.flex}>
        <div className={styles.flex1}>{!wallet && <Wallet />}</div>
        <div className={styles.flex2}>
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default CabinetPage;
