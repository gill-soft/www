import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messanges } from "../../intl/NavMessanges";
import styles from "./AuthorizationHeader.module.css";
import { ReactComponent as Account } from "../../images/account.svg";
import { getLang } from "../../redux/Language/LanguageSelectors";

const AuthorizationHeader = () => {
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const isAuth = JSON.parse(localStorage.getItem("auth"));
  const history = useHistory();
  const handleExit = () => {
    localStorage.removeItem("auth");
    history.push("/");
    window.location.reload();
  };
  return (
    <IntlProvider locale={locale} messages={messanges[locale]}>
      {isAuth ? (
        <div className={styles.box}>
          <Link to='/cabinet' className={styles.name}>{isAuth.clientName || isAuth.login}</Link>
          <button className={styles.exitBtn} onClick={handleExit}>
            <FormattedMessage id="exit" />
          </button>
        </div>
      ) : (
        <Link to="/authorization" className={styles.box}>
          <Account style={{ marginRight: "6px" }} fill="var(--color-secondary)" />
          <p>
            <FormattedMessage id="cabinet" />
          </p>
        </Link>
      )}
    </IntlProvider>
  );
};

export default AuthorizationHeader;
