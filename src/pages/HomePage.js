import React from "react";
import styles from "./HomePage.module.css";
import SearchForm from "../components/SearchForm/SearchForm";
import { connect } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/HomePageMessanges";
import CryptoJS from "crypto-js";

const HomePage = ({ history, lang }) => {
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.bgnd}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <FormattedMessage id="title" />
          </h1>
          <p className={styles.subtitle}>
            <FormattedMessage id="subtitle" />
          </p>
          <div className={styles.formContainer}>
            <SearchForm history={history} />
          </div>
          <ul className={styles.iconsBox}>
            <li className={`${styles.iconItem} ${styles.iconItem1}`}>
              <p>
                <FormattedMessage id="iconItem1" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem2}`}>
              <p>
                <FormattedMessage id="iconItem2" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem3}`}>
              <p>
                <FormattedMessage id="iconItem3" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem4}`}>
              <p>
                <FormattedMessage id="iconItem4" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem5}`}>
              <p>
                <FormattedMessage id="iconItem5" />
              </p>
            </li>
          </ul>
        </div>
      </div>
    </IntlProvider>
  );
};
const mapStateToProps = (state) => ({
  lang: state.language,
});

export default connect(mapStateToProps)(HomePage);
