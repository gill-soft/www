import React, { useState } from "react";
import { connect } from "react-redux";
import { format } from "date-fns";
import styles from "./TripBox.module.css";
import { Link } from "react-router-dom";
import { fetchOrderInfo } from "../../redux/order/orderActions";

const TripBox = ({ trip, trips, fetchOrderInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [arrayStops, setArrayStops] = useState([]);

  const getStop = (val) => {
    const key = trip[`${val}`].id;
    return trips.localities[`${key}`].name["UA"];
  };

  const getAllLocalities = (key) => {
    return trips.localities[`${key}`].name["UA"];
  };

  const getLocality = (val) => {
    const key = trips.tripContainers[0].request.localityPairs[0][val];
    return trips.localities[`${key}`].name["UA"];
  };

  const getTime = (key) => {
    return format(new Date(trip[`${key}`]), "HH:mm");
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

  const handleAdditionals = () => {
    // ==== определяем id первой остановки ====//
    const first = trip.departure.id;
    // ==== определяем индекс первой остановки ====//
    const idx = trip.route.path.indexOf(
      trip.route.path.find((el) => el.locality.id === first)
    );
    // ==== обрезаем массив всех остановок с нужной нам ==== //
    const arr = trip.route.path.slice(idx);
    // ==== записываем state в обрезаный масив ==== //
    setArrayStops(arr);
    // ==== переключаем видимость дополнительной информации ==== //
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <h5>{trip.route.name.EN}</h5>
      <div className={styles.full}>
        <div className={styles.tripBox}>
          <div className={styles.info}>
            <div>
              <p className={styles.time}>{getTime("departureDate")}</p>
              <p className={styles.date}>{getDate("departureDate")}</p>
            </div>
            <p className={styles.locality}>{getLocality(0)}</p>
            <p>{getStop("departure")}</p>
            <button onClick={handleAdditionals}>Дополнительная информация</button>
          </div>
          <div className={styles.info}>
            <div>
              <p className={styles.time}> {getTime("arrivalDate")}</p>
              <p className={styles.date}>{getDate("arrivalDate")}</p>
            </div>
            <p className={styles.locality}>{getLocality(1)}</p>
            <p>{getStop("arrival")}</p>
          </div>

          <p className={styles.timeInWay}>{getTimeInWay()} в пути</p>
          <div>
            <p>Цена {getPrice()}</p>
            <Link
              to={{
                pathname: `/order`,
              }}
              onClick={handleClick}
            >
              Заказвть
            </Link>
          </div>
        </div>
        {isOpen &&
          arrayStops.map((el) => (
            <div key={el.locality.id}>
              <p>{getAllLocalities(el.locality.id)}</p>
              {/* <p>w</p> */}
            </div>
          ))}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  trips: state.trips.trips,
});
const mapDispatchToProps = (dispatch) => ({
  fetchOrderInfo: (obj) => dispatch(fetchOrderInfo(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripBox);
