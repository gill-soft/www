import React, { useState } from "react";
import { connect } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/Order/FormForBuy";
import styled from "styled-components";
import styles from './OrderPage.module.css'

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 50px 0 0 10px;
`;

const OrderPage = ({ history, amountPassangers }) => {
  const [totalPassanger, setTotalPassanger] = useState(amountPassangers);

  const changeAmountPassanger = (val) => {
    setTotalPassanger(val);
  };
  return (
    <div className={styles.container}>
      <SearchForm history={history} />
        <FormForBuy changeAmountPassanger={changeAmountPassanger} total={totalPassanger} history={history}/>
        <OrderInfo total={totalPassanger}/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
});

export default connect(mapStateToProps)(OrderPage);
