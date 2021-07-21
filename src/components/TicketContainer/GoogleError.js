import React from "react";
import { useSelector } from "react-redux";
import styles from "./ReturnConditions.module.css";
import { ReactComponent as Close } from "../../images/clear-black-36dp.svg";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";

const GoogleError = React.forwardRef(({ close }, ref) => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.box} ref={ref}>
        <Close fill="var(--color-main)" onClick={close} className={styles.close} />
        <p className={styles.title}>
          <FormattedMessage id="googleError" />
        </p>
      </div>
    </IntlProvider>
  );
});

export default GoogleError;
