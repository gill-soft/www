import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getError } from "../redux/global/globalActions";
import styles from "./ErrorPage.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/HomePageMessages";

const ErrorPage = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="container">
        <p className={styles.smile}>
          <FormattedMessage id="oops" />
        </p>
        <Link to="/" className={styles.link} onClick={() => dispatch(getError(""))}>
          <FormattedMessage id="goHome" />
        </Link>
      </div>
    </IntlProvider>
  );
};

export default ErrorPage;
