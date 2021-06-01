import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import SearchForm from "../components/SearchForm/SearchForm";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/HomePageMessanges";
import { Redirect, useHistory } from "react-router-dom";
import FavoriteTrips from "../components/FavoriteTrips/FavoriteTrips";
import AppLinks from "../components/AppLinks/AppLinks";
import Advantages from "../components/Advantages/Advantages";
import { getDescription, getTitle } from "../services/headTags";
import SearchFormBaner from "../components/SearchFormBaner/SearchFormBaner";
import MobileBaner from "../components/MobileBaner/MobileBaner";
import Modal from "@material-ui/core/Modal";

const HomePage = () => {
  const lang = useSelector((state) => state.language);
  const error = useSelector((state) => state.global.error);
  const history = useHistory();
  const [isModal, setIsModal] = useState(true);
  const [scroll, setScroll] = useState(false);
  const windowWidth = window.innerWidth;
  const locale = lang === "UA" ? "UK" : lang;
  useEffect(() => {
    const timer = setTimeout(() => setIsModal(false), 10000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (windowWidth >= 768 && window.scrollY >= 450) setScroll(true);
    if (windowWidth >= 768 && window.scrollY < 450) setScroll(false);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  return (
    <>
      {/* <Helmet>
        <meta name="description" content={getDescription(lang)} />
        <title>{getTitle(lang)}</title>
      </Helmet> */}
      {error && <Redirect to="/error" />}
      {windowWidth < 768 && isModal && (
        <Modal open={isModal} onClose={closeModal} className={styles.modal}>
          <AppLinks onClose={closeModal} />
        </Modal>
      )}
      {windowWidth >= 768 && <SearchFormBaner history={history} scroll={scroll} />}
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.bgnd}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              <FormattedMessage id="title" />
            </h1>
            <div className={styles.formContainer}>
              <SearchForm history={history} scroll={scroll} />
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
        {windowWidth >= 768 && <MobileBaner />}

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
