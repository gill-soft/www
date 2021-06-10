import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import {
  decrementAmountPassangers,
  incrementAmountPassangers,
} from "../../redux/searchForm/searchFormAction";
import { messages } from "../../intl/HomePageMessages";
import { ReactComponent as Plus } from "../../images/add-black-18dp.svg";
import { ReactComponent as Minus } from "../../images/remove-black-18dp.svg";
import styles from "./AmountPassanger.module.css";

const AmountPassanger = () => {
  // ==== redux ==== //
  const dispatch = useDispatch();
  const amount = useSelector((state) => state.searchForm.amountPassanger);
  const lang = useSelector((state) => state.language);

  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.amountBox}>
        <p className={styles.textP}>
          <FormattedMessage id="inputAmount" />:{" "}
        </p>
        <div className={styles.flex}>
          <button
            type="button"
            className={styles.button}
            name="decrement"
            disabled={amount <= 1}
            onClick={() => dispatch(decrementAmountPassangers())}
          >
            {" "}
            <Minus />{" "}
          </button>
          <span>{amount}</span>
          <button
            type="button"
            className={styles.button}
            name="increment"
            disabled={amount >= 10}
            onClick={() => dispatch(incrementAmountPassangers())}
          >
            <Plus />
          </button>
        </div>
      </div>
    </IntlProvider>
  );
};

export default AmountPassanger;
