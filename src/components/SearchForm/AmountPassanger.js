import React from "react";
import { connect } from "react-redux";
import styles from "./AmountPassanger.module.css";
import {
  decrementAmountPassangers,
  incrementAmountPassangers,
} from "../../redux/searchForm/searchFormAction";
import { ReactComponent as Plus } from "../../images/add-black-18dp.svg";
import { ReactComponent as Minus } from "../../images/remove-black-18dp.svg";

const AmountPassanger = ({ amount, increment, decrement }) => {
  return (
    <div className={styles.amountBox}>
      <p>Пассажиры: </p>
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
  );
};

const mapStateToProps = (state) => ({
  amount: state.searchForm.amountPassanger,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(incrementAmountPassangers()),
  decrement: () => dispatch(decrementAmountPassangers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AmountPassanger);
