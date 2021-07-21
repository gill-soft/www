import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/AgentPageMessage";
import { getLang } from "../../redux/Language/LanguageSelectors";
import styles from "./Wallet.module.css";
import { getWalletAmount, getWalletArray } from "../../redux/order/orderSelectors";

const Wallet = () => {
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const wallet = useSelector(getWalletArray);
  const walletAmount = useSelector(getWalletAmount);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.sticky}>
        <h2 className={styles.title}>
          <FormattedMessage id="myBonus" />
        </h2>
        <div className={styles.box}>
          <div className={styles.flex}>
            <p className={styles.bonusTitle}>
              <FormattedMessage id="credited" />
            </p>
            <p className={styles.bonusTitle}>
              <FormattedMessage id="expireTime" />
            </p>
          </div>
          {wallet.length > 0 &&
            wallet.map((el, idx) => (
              <div className={styles.flex} key={idx}>
                <p className={styles.bonusAmount}>
                  {el.credit}
                  <small><FormattedMessage id="uah" /></small>
                </p>

                <p className={styles.bonusAmount}>
                  {new Date(el.expired).toLocaleString(lang, {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
                </p>
              </div>
            ))}
          <p className={styles.total}>
            <FormattedMessage id="total" />
            {walletAmount}
            <small>
              <FormattedMessage id="uah" />
            </small>
          </p>
        </div>
      </div>
    </IntlProvider>
  );
};

export default Wallet;
