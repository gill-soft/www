import React from "react";
import { connect } from "react-redux";
import styles from "./AmountPassanger.module.css";
import {
  decrementAmountPassangers,
  incrementAmountPassangers,
} from "../../redux/searchForm/searchFormAction";
import { ReactComponent as Plus } from "../../images/add-black-18dp.svg";
import { ReactComponent as Minus } from "../../images/remove-black-18dp.svg";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessanges";

const AmountPassanger = ({ amount, increment, decrement, lang }) => {
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>

    <div className={styles.amountBox}>
    
      <p><FormattedMessage id="inputAmount" />: </p>
      <div className={styles.flex}>
        <button
          type="button"
          className={styles.button}
          name="decrement"
          disabled={amount <= 1}
          onClick={() => decrement()}
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
          onClick={() => increment()}
        >
          <Plus />
        </button>
      </div>
    </div>
    </IntlProvider>
  );
};

const mapStateToProps = (state) => ({
  amount: state.searchForm.amountPassanger,
  lang: state.language,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(incrementAmountPassangers()),
  decrement: () => dispatch(decrementAmountPassangers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AmountPassanger);
