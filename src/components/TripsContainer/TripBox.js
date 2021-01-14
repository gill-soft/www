import React, { useState } from "react";
import { connect } from "react-redux";
import { format } from "date-fns";
import styles from "./TripBox.module.css";

// import Button from "@material-ui/core/Button";
// import FormForBuy from "./FormForBuy";
import { getLocality } from "../../services/getInfo";

const TripBox = ({ trip, trips, isLoading, stops }) => {
  // const [isForm, setIsForm] = useState(false);

  const getDepartureStop = () => {
    const key = trip.departure.id;
    return trips.localities[`${key}`].name["UA"];
  };
  const getDepartureTime = () => {
    return format(new Date(trip.departureDate), "HH : mm");
  };
  const getArrivalStop = () => {
    const key = trip.arrival.id;
    return trips.localities[`${key}`].name["UA"];
  };
  const getArrivalTime = () => {
    return format(new Date(trip.arrivalDate), "HH : mm");
  };
  const getTimeInWay = () => {
    return trip.timeInWay;
  };
  const getPrice = () => {
    return trip.price.amount;
  };

  return (
    <div>
      <div className={styles.tripBox}>
        <h5>{trip.route.name.EN}</h5>
        <p>{getLocality(stops, trips.tripContainers[0].request.localityPairs[0][0])}</p>
        <p>{getDepartureStop()}</p>
        <p>Время отправки {getDepartureTime()}</p>
        <p>{getLocality(stops, trips.tripContainers[0].request.localityPairs[0][1])}</p>
        <p>{getArrivalStop()}</p>
        <p>Время прибытия {getArrivalTime()}</p>
        <p>Время в пути {getTimeInWay()}</p>
        <p>Цена {getPrice()}</p>
        {/* <Button onClick={() => setIsForm(true)}>BUY!</Button> */}
        {/* {isForm && <FormForBuy />} */}
      </div>

      {/* <pre>{JSON.stringify(trips, null, 2)}</pre> */}
    </div>
  );
};
const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  isLoading: state.trips.isLoading,
  stops: state.searchForm.stops,
});

export default connect(mapStateToProps)(TripBox);
