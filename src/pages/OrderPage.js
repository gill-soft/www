import React from "react";
import { connect } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/Order/FormForBuy";

const OrderPage = ({ history, amountPassangers}) => {
  return (
    <div>
      <SearchForm history={history} />
      <FormForBuy />
      <OrderInfo />
    </div>
  );
};

const mapStateToProps = (state) => ({
  amountPassangers: state.order.amountPassangers
});


export default connect(mapStateToProps)(OrderPage);
