import React, { useEffect } from "react";
import { connect } from "react-redux";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/TripsContainer/FormForBuy";
import TripsContainer from "../components/TripsContainer/TripsContainer";
import { fetchStops } from "../redux/searchForm/searchFormOperation";

const HomePage = ({ isVisibleTrips, isVisibleOrder, history, fetchStops }) => {
  
  //  ==== получаем все остановки через redux ==== //
  useEffect(() => {
    fetchStops();
  }, [fetchStops]);
  return (
    <div>
      <SearchForm history={history} />
      {/* {isVisibleTrips && <TripsContainer />}
      {isVisibleOrder && <FormForBuy />} */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isVisibleTrips: state.trips.isVisibleTrips,
  isVisibleOrder: state.order.isVisibleOrder,
});

const mapDispatchToProps = (dispatch) => ({
  fetchStops: () => dispatch(fetchStops()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
