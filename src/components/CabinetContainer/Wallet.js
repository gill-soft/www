import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
// import { messages } from "../intl/AgentPageMessage";
import { getLang } from "../../redux/Language/LanguageSelectors";
import styles from "./Wallet.module.css";
import { getWalletAmount, getWalletArray } from "../../redux/order/orderSelectors";

const Wallet = () => {
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const wallet = useSelector(getWalletArray);
  const walletAmount = useSelector(getWalletAmount);
  // const getTotalBonus = () => {
  //   const credit = wallet.reduce((summ, el) => {
  //     return (summ += el.credit);
  //   }, 0);
  //   const debit = wallet.reduce((summ, el) => {
  //     return (summ += el.debit);
  //   }, 0);
  //   return credit - debit;
  // };
  return (
    <div className={styles.sticky}>
      <h2 className={styles.title}>Мої бонуси</h2>
      <div className={styles.box}>
        <div className={styles.flex}>
          <p className={styles.bonusTitle}>Зараховано</p>
          <p className={styles.bonusTitle}>Термін дії</p>
        </div>
        {wallet.length > 0 &&
          wallet.map((el, idx) => (
            <div className={styles.flex} key={idx}>
              <p className={styles.bonusAmount}>
                {el.credit}
                <small>{el.currency}</small>
              </p>

              <p className={styles.bonusAmount}>
                {new Date(el.expired).toLocaleString("RU", {
                  year: "2-digit",
                  month: "long",
                  day: "2-digit",
                })}
              </p>
            </div>
          ))}
        <p className={styles.total}>
          Total: {walletAmount}
          <small> UAH</small>
        </p>
      </div>
    </div>
  );
};

export default Wallet;
