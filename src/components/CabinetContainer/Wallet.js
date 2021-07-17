import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
// import { messages } from "../intl/AgentPageMessage";
import { getLang } from "../../redux/Language/LanguageSelectors";
import styles from "./Wallet.module.css";

const Wallet = (wallet) => {
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  return (
    <table className={styles.table}>
        <caption>Ваші бонуси</caption>
      <tr>
        <th>зараховано</th>
        <th>списано</th>
        <th>срок дії</th>
      </tr>
      {wallet.length > 0 &&
        wallet.map((el, idx) => (
          <tr key={idx}>
            <td>
              {el.credit}
              <small>{el.currency}</small>
            </td>
            <td>
              {el.debit}
              <small>{el.currency}</small>
            </td>
            {/* <td>{new Date(el.expired)}</td> */}
          </tr>
        ))}
        <th>Total:</th>
    </table>
  );
};

export default Wallet;
