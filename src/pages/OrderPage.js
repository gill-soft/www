import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/Order/FormForBuy";
import styles from "./OrderPage.module.css";

const OrderPage = ({ history, amountPassangers, order, location }) => {
  const [totalPassanger, setTotalPassanger] = useState(amountPassangers);

  const changeAmountPassanger = (val) => {
    setTotalPassanger(val);
  };

  return (
    <div className={styles.bgnd}>
      <div className={styles.container}>
        <div className={styles.formBox}>
          <SearchForm history={history} />
        </div>
        <div className={styles.main}>
          <FormForBuy
            changeAmountPassanger={changeAmountPassanger}
            total={totalPassanger}
            history={history}
          />
          <OrderInfo total={totalPassanger} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
  order: state.order.order,
});

export default connect(mapStateToProps)(OrderPage);
