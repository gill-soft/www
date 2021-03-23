import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import SearchForm from "../components/SearchForm/SearchForm";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/HomePageMessanges";
import { Redirect, useHistory } from "react-router-dom";
import FavoriteTrips from "../components/FavoriteTrips/FavoriteTrips";
import Modal from "../components/Modal/Modal";
import AppLinks from "../components/AppLinks/AppLinks";
import Advantages from "../components/Advantages/Advantages";

const HomePage = () => {
  const lang = useSelector((state) => state.language);
  const error = useSelector((state) => state.global.error);
  const history = useHistory();
  const [isModal, setIsModal] = useState(true);
  const windowWidth = window.innerWidth;
  const locale = lang === "UA" ? "UK" : lang;
  useEffect(() => {
    const timer = setTimeout(() => setIsModal(false), 8500);
    // console.log(timer)
    // timer()
    return () => {
      clearTimeout(timer)
    }
  }, []);
  const closeModal = () => {
    setIsModal(false);
  };
  
  return (
    <>
      <Helmet>
        <title>Купити квитки на автобус онлайн, квитки на автобус, Veze</title>
      </Helmet>
      {error && <Redirect to="/error" />}
      {windowWidth < 768 && isModal && (
        <Modal onClose={closeModal} component={<AppLinks onClose={closeModal} />} />
      )}
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
        <div className={styles.bgndBottom}>
          <div className={`${styles.information} ${styles.container}`}>
            <FavoriteTrips />
            <Advantages />
          </div>
        </div>
      </IntlProvider>
    </>
  );
};

export default HomePage;
