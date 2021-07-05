import React from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { useSelector } from "react-redux";
import styles from "./Success.module.css";
import { ReactComponent as Close } from "../../images/clear-black-36dp.svg";
import { isIOS } from "react-device-detect";

const Success = React.forwardRef(({ url, id, closeModal, isModal = true }, ref) => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={isModal ? styles.box : styles.boxx} ref={ref} tabIndex="-1">
        {isModal && (
          <button className={styles.closeBtn} type="button" onClick={closeModal}>
            <Close fill="var(--color-secondary)" />
          </button>
        )}
        <p className={styles.text}>
          <FormattedMessage id="number" />
          <span className={styles.blue}>{id}</span>
        </p>
        <h1 className={styles.blue}>
          <FormattedMessage id="success" />
        </h1>

        <p className={styles.text}>
          <FormattedMessage id="forDownload" />
          {!isIOS ? (
            <a
              className={styles.appLink}
              href="https://play.google.com/store/apps/details?id=com.veze.gds"
            >
              VEZE
            </a>
          ) : (
            <span className={styles.appLink}>VEZE</span>
          )}
          <FormattedMessage id="or"/>
          <a className={styles.appLink} href={url} target="_blank" rel="noreferrer">
            <FormattedMessage id="download" />
          </a>
        </p>
        <p className={styles.helperText}>
          <FormattedMessage id="dontPrint" />
        </p>
      </div>
    </IntlProvider>
  );
});

export default Success;
