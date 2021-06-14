import React from "react";
import { useSelector } from "react-redux";

import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import styles from "./NoTrips.module.css";
import { ReactComponent as SearchOff } from "../../images/search_off-black-48dp.svg";

const NoTrips = () => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.box}>
        <div className={styles.svg}>
          <SearchOff fill="var(--color-main" />
        </div>
        <h2 className={styles.title}>
          <FormattedMessage id="hasntTrips" />{" "}
        </h2>
        <p>
          <FormattedMessage id="allPosible" />
        </p>
      </div>
    </IntlProvider>
  );
};

export default NoTrips;
