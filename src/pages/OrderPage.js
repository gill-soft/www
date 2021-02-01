import React, { useState } from "react";
import { connect } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/Order/FormForBuy";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  padding: 50px 0 0 10px;
`;

const OrderPage = ({ history, amountPassangers }) => {
  const [totalPassanger, setTotalPassanger] = useState(amountPassangers);
  
  const changeAmountPassanger = (val) => {
    setTotalPassanger(val);
  };
  return (
    <div>
      <SearchForm history={history} />
      <Div>
        <FormForBuy changeAmountPassanger={changeAmountPassanger} total={totalPassanger}/>
        <OrderInfo total={totalPassanger}/>
      </Div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
});

export default connect(mapStateToProps)(OrderPage);
