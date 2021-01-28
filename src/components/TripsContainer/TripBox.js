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
  const getCurrency = () => {
    return trip.price.currency;
  };

  const handleClick = () => {
    const obj = {
      from: getLocality(0),
      fromStop:getStop("departure"),
      toStop: getStop("arrival"),
      to: getLocality(1),
      departureDate: trip.departureDate,
      arrivalDate: trip.arrivalDate,
      price: trip.price.amount,
      
    };
    fetchOrderInfo(obj);
  };

  const handleAdditionals = () => {
    // ==== определяем индекс первой остановки ====//
    const first =
      1 + trip.route.path.indexOf(trip.route.path.find((el) => el.locality.id === trip.departure.id));
    //  ==== определяем индекс последней остановки ==== //
    const last =  trip.route.path.indexOf(trip.route.path.find((el) => el.locality.id === trip.arrival.id)) 

    // ==== обрезаем массив всех остановок ==== //
    const arr = trip.route.path.slice(first, last);
    // ==== записываем  в state обрезаный масив ==== //
    setArrayStops(arr);
    // ==== переключаем видимость дополнительной информации ==== //
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={styles.full}>
        <div className={styles.tripBox}>
          <div className={styles.info}>
            <div>
              <p className={styles.time}>{getTime("departureDate")}</p>
              <p className={styles.date}>{getDate("departureDate")}</p>
            </div>
            <p className={styles.locality}>{getLocality(0)}</p>
            <p className={styles.localityStop}>{getStop("departure")}</p>
            <button className={styles.additionals} onClick={handleAdditionals}>Детали рейса</button>
          </div>
          <div className={styles.info}>
            <div>
              <p className={styles.time}> {getTime("arrivalDate")}</p>
              <p className={styles.date}>{getDate("arrivalDate")}</p>
            </div>
            <p className={styles.locality}>{getLocality(1)}</p>
            <p className={styles.localityStop}>{getStop("arrival")}</p>
          </div>

          <p className={styles.timeInWay}>{getTimeInWay()} в пути</p>
          <div className={styles.priceBox}>
            <p className={styles.price}>
              {getPrice()} <span>{getCurrency()}</span>{" "}
            </p>
            <Link
              className={styles.choose}
              to={{
                pathname: `/order`,
              }}
              onClick={handleClick}
            >
              Выбрать
            </Link>
          </div>
        </div>
        {isOpen && (
          <>
            <h5>{trip.route.name.EN}</h5>
            <div className={styles.additionalInfo}>
              <div className={styles.depArr}>
                <p className={styles.departure}>Отправление</p>
                <p className={styles.arrival}>Прибытие</p>
              </div>
              <div>
                <div className={styles.start}>
                  <p className={`${styles.locality} ${styles.addLocality} `}>
                    {getLocality(0)}
                  </p>
                  <p>{getStop("departure")}</p>
                </div>
                <div >
                  {arrayStops.map((el) => (
                      <p className={styles.stop} key={el.locality.id}>{getAllLocalities(el.locality.id)}</p>
                  ))}{" "}
                </div>
                <div className={`${styles.start} ${styles.finish}`}>
                  <p className={`${styles.locality} ${styles.addLocality} `}>
                    {getLocality(1)}
                  </p>
                  <p>{getStop("arrival")}</p>
                </div>
              </div>
            </div>
          </>
        )}
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
