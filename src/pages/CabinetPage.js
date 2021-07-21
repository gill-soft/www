import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./CabinenPage.module.css";

import { IntlProvider, FormattedMessage } from "react-intl";
// import { messages } from "../intl/AgentPageMessage";
import { getLang } from "../redux/Language/LanguageSelectors";
import Wallet from "../components/CabinetContainer/Wallet";
import SearchBox from "../components/CabinetContainer/SearchBox";
import { getWalletInfo } from "../redux/order/orderOperation";

const CabinetPage = () => {
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const dispatch = useDispatch();
  const getWallet = useCallback(() => dispatch(getWalletInfo()), [dispatch]);

  useEffect(() => {
    getWallet();
  }, [getWallet]);
  
  return (
    <div className="container">
      <div className={styles.flex}>
        <div className={styles.flex1}>
          <Wallet />
        </div>
        <div className={styles.flex2}>
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default CabinetPage;
