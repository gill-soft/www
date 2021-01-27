import React from "react";
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
  return (
    <div>
      <SearchForm history={history} />
      <Div>
        <FormForBuy />
        <OrderInfo />
      </Div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  amountPassangers: state.order.amountPassangers,
});

export default connect(mapStateToProps)(OrderPage);
