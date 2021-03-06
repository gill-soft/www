import React from "react";
import { Link } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { useSelector } from "react-redux";

import styles from "./GoHome.module.css";

const GoHome = React.forwardRef((props, ref) => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <div className={styles.box} ref={ref} tabIndex="-1">
      <IntlProvider locale={locale} messages={messages[locale]}>
        <p className={styles.text}>
          <FormattedMessage id="booking" />
        </p>
        <Link to="/" className={styles.link}>
          <FormattedMessage id="goHome" />
        </Link>
      </IntlProvider>
    </div>
  );
});

export default GoHome;
