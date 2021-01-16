import React from "react";
import { connect } from "react-redux";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/TripsContainer/FormForBuy";
import TripsContainer from "../components/TripsContainer/TripsContainer";

const HomePage = ({ isVisibleTrips, isVisibleOrder }) => {
  return (
    <div>
      <SearchForm />
      {isVisibleTrips && <TripsContainer />}
      {isVisibleOrder && <FormForBuy />}
    </div>
  );
};

const mapStateToProps = (state) => ({
    isVisibleTrips: state.trips.isVisibleTrips,
    isVisibleOrder: state.order.isVisibleOrder
});

// const mapDispatchToProps = {

// }

export default connect(mapStateToProps)(HomePage);
