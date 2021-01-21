import React from "react";
import { connect } from "react-redux";
import { format } from "date-fns";
import styles from "./TripBox.module.css";
import { Link } from "react-router-dom";
import { changeIsVisible } from "../../redux/trips/tripsActions";
import { changeIsVisibleOrder, fetchOrderInfo } from "../../redux/order/orderActions";

const TripBox = ({ trip, trips, fetchOrderInfo }) => {
  
  const getStop = (val) => {
    const key = trip[`${val}`].id;
    return trips.localities[`${key}`].name["UA"];
  };
  const getLocality = (val) => {
    // console.log(trips.tripContainers[0].request.localityPairs[0][val])
    const key = trips.tripContainers[0].request.localityPairs[0][val]
    return trips.localities[`${key}`].name["UA"];
   
  };
  const getTime = (key) => {
    return format(new Date(trip[`${key}`]), "HH : mm");
  };
  const getDate = (key) => {
    return new Date(trip[`${key}`]).toLocaleString("uk", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };
  const getTimeInWay = () => {
    return `${+trip.timeInWay.split(":")[0]}ч ${trip.timeInWay.split(":")[1]}мин`;
  };

  const getPrice = () => {
    return trip.price.amount;
  };
  const handleClick = () => {
    const obj = {
      from: getLocality(0),
      to: getLocality(1),
      departureDate: trip.departureDate,
      arrivalDate: trip.arrivalDate,
      price: trip.price.amount,
    };
    fetchOrderInfo(obj);
  };

  return (
    <div>
      <div className={styles.tripBox}>
        <div>
          <p className={styles.time}>{getTime("departureDate")}</p>
          <p>{getDate("departureDate")}</p>
        </div>
        <p>{getLocality(0)}</p>
        <p>{getStop("departure")}</p>
        <p>{getLocality(1)}</p>
        <p>{getStop("arrival")}</p>
        <div>
          <p> {getTime("arrivalDate")}</p>
          <p>{getDate("arrivalDate")}</p>
        </div>

        <p>{getTimeInWay()}в пути</p>
        <p>Цена {getPrice()}</p>
        <h5>{trip.route.name.EN}</h5>
        <Link
          to={{
            pathname: `/order`,
          }}
          onClick={handleClick}
        >
          Заказвть
        </Link>
        {/* <button onClick={hdl}>BUY!</button> */}
      </div>

      {/* <pre>{JSON.stringify(trips, null, 2)}</pre> */}
    </div>
  );
};
const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  isLoading: state.trips.isLoading,
  from: state.searchForm.from,
  to: state.searchForm.to,
});
const mapDispatchToProps = (dispatch) => ({
  changeIsVisible: (bool) => dispatch(changeIsVisible(bool)),
  changeIsVisibleOrder: (bool) => dispatch(changeIsVisibleOrder(bool)),
  fetchOrderInfo: (obj) => dispatch(fetchOrderInfo(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripBox);
