import React from "react";
import { connect } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import PassengersInfo from "../components/Order/PassengersInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/TripsContainer/FormForBuy";
// import { getForm } from "../services/getForm";

const OrderPage = ({ history, amountPassangers}) => {
  return (
    <div>
      <SearchForm history={history} />
      {/* {amountPassangers.map((el, idx) => <PassengersInfo key={idx} n={idx+1}/> )} */}
      <FormForBuy />
      <OrderInfo />
    </div>
  );
};

const mapStateToProps = (state) => ({
  amountPassangers: state.order.amountPassangers
});


export default connect(mapStateToProps)(OrderPage);
