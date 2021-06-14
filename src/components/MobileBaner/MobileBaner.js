import React from "react";
import { useSelector } from "react-redux";

import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessages";
import styles from "./MobileBaner.module.css";
import android from "../../images/google-play-300x116.png";
import ios from "../../images/appstore.png";

const MobileBaner = () => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>

    <div className={styles.bgnd}>
      <div className={`container ${styles.box}`}>
          <div>
        <h2 className={styles.title}><FormattedMessage id="mobileTitle" /></h2>
        <p className={styles.text}><FormattedMessage id="mobileText" /></p></div>
        <div className={styles.imgsBox}>
          <div className={styles.img}>
            <img src={android} width="260px" height="77px" alt="google play" />
          </div>
          <div className={styles.img}>
            <img src={ios} width="360px" height="77px" alt="appstore" />
          </div>
        </div>
      </div>
    </div></IntlProvider>
  );
};

export default MobileBaner;
