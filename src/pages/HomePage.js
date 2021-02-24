import React from "react";
import styles from "./HomePage.module.css";
import SearchForm from "../components/SearchForm/SearchForm";
import { useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/HomePageMessanges";
import { Redirect, useHistory } from "react-router-dom";

const HomePage = () => {
  const lang = useSelector((state) => state.language);
  const error = useSelector((state) => state.global.error);
  const history = useHistory();
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <>
      {error && <Redirect to="/error" />}
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
    </>
  );
};

export default HomePage;
