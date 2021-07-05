import React from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessages";
import { useSelector } from "react-redux";
import styles from "./AppLinks.module.css";
import play from "../../images/google-play-300x116.png";
// import app from "../../images/appstore.png";
import { ReactComponent as Close } from "../../images/clear-black-36dp.svg";


const AppLinks = React.forwardRef(({ onClose }, ref) => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div ref={ref} tabIndex="-1" className={styles.box}>
        <div className={styles.progress2}>
          <div className={styles.progress}></div>
        </div>
        <button className={styles.btn} onClick={() => onClose()}>
          <Close fill="var(--color-secondary)" />
        </button>
        <div className={styles.container}>
          <p className={styles.text}>
          <FormattedMessage id="text" />
          </p>
          <div className={styles.img}>
            <a href="https://play.google.com/store/apps/details?id=com.veze.gds">
              <img src={play} alt="playMarket"></img>
            </a>
          </div>
          {/* <div className={styles.img}>
            <img src={app} alt="appStore"></img>
          </div> */}
        </div>
      </div>
    </IntlProvider>
  );
});

export default AppLinks;
