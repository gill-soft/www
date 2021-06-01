import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./TripBox.module.css";
import { CSSTransition } from "react-transition-group";
import "../../stylesheet/animation.css";
import { setTripKeys } from "../../redux/order/orderActions";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import {
  getCity,
  getStop,
  getDate,
  getTime,
  getTimeInWayDouble,
  getAddress,
  getPrice,
  getRouteName,
} from "../../services/getInfo";

const DoubleTrips = ({ tripKeys, location }) => {
  const trips = useSelector((state) => state.trips.trips);
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const sendTripsKey = (arr) => dispatch(setTripKeys(arr));
  const [isOpen, setIsOpen] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [freeSeats, setFreeSeats] = useState(0);
  const [arrayStops, setArrayStops] = useState([]);
  const locale = lang === "UA" ? "UK" : lang;
  const backdropRef = useRef(null);
  const lastKey = tripKeys[tripKeys.length - 1];

  useEffect(() => {
    // ==== проверям есть ли остановки в поездке ==== //
    const array = tripKeys.reduce((arr, el) => {
      trips.segments[el].route ? arr.push(true) : arr.push(false);
      return arr;
    }, []);
    setIsDetails(array.every(el=> el === true));
// ==== определяем минимальное количество мест на маршруте ==== //
    const freeSeatsArray = tripKeys.reduce((arr, el) => {
      arr.push(+trips.segments[el].freeSeatsCount);
      return arr;
    }, []);
    setFreeSeats(Math.min(...freeSeatsArray));
  }, [tripKeys, trips.segments]);
  
  const handleClick = () => {
    sendTripsKey(tripKeys);
    sessionStorage.setItem(
      "path",
      JSON.stringify(`${location.pathname}${location.search}`)
    );
  };
  const handleAdditionals = () => {
    const stopsArray = tripKeys.map((el) => {
      // ==== определяем индекс первой остановки ====//
      const first =
        1 +
        trips.segments[el].route.path.indexOf(
          trips.segments[el].route.path.find(
            (item) => item.locality.id === trips.segments[el].departure.id
          )
        );
      //  ==== определяем индекс последней остановки ==== //
      const last = trips.segments[el].route.path.indexOf(
        trips.segments[el].route.path.find(
          (item) => item.locality.id === trips.segments[el].arrival.id
        )
      );
      // ==== обрезаем массив всех остановок ==== //
      const arr = trips.segments[el].route.path.slice(first, last);
      return arr;
    });
    setArrayStops(stopsArray);

    // ==== переключаем видимость дополнительной информации ==== //
    setIsOpen(!isOpen);
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={!isOpen ? styles.full : styles.fullOpen}>
        <div className={styles.tripBox}>
          <p className={styles.timeInWay}>
            {getTimeInWayDouble(tripKeys, trips, lang)}{" "}
            <FormattedMessage id="timeInWay" />
          </p>
          <div className={styles.fromTo}>
            <div className={styles.info}>
              <div>
                <p className={styles.time}>
                  {getTime("departureDate", trips.segments[tripKeys[0]], locale)}
                </p>
                <p className={styles.date}>
                  {getDate("departureDate", trips.segments[tripKeys[0]], locale)}
                </p>
              </div>
              <p className={styles.locality}>
                {getCity(trips.segments[tripKeys[0]].departure.id, trips, lang)}
              </p>
              <p className={styles.localityStop}>
                {getStop(trips.segments[tripKeys[0]].departure.id, trips, lang)}
              </p>
              <p className={styles.address}>
                {getAddress(trips.segments[tripKeys[0]].departure.id, trips, lang)}
              </p>
            </div>
            <div className={`${styles.info} ${styles.infoLast}`}>
              <div>
                <p className={styles.time}>
                  {getTime("arrivalDate", trips.segments[lastKey], locale)}
                </p>
                <p className={styles.date}>
                  {getDate("arrivalDate", trips.segments[lastKey], locale)}
                </p>
              </div>
              <p className={styles.locality}>
                {getCity(trips.segments[lastKey].arrival.id, trips, lang)}
              </p>
              <p className={styles.localityStop}>
                {getStop(trips.segments[lastKey].arrival.id, trips, lang)}
              </p>
              <p className={styles.address}>
                {getAddress(trips.segments[lastKey].arrival.id, trips, lang)}
              </p>
            </div>
          </div>

          <div className={styles.priceBox}>
            <p className={styles.price}>
              {getPrice(tripKeys, trips).toFixed(2)}
              <span>{trips.segments[tripKeys[0]].price.currency}</span>
            </p>
            <Link
              className={styles.choose}
              to={{
                pathname: `/order`,
                state: { from: location },
              }}
              onClick={handleClick}
            >
              <FormattedMessage id="choose" />
            </Link>
            {/*  */}
            <p
              className={
                freeSeats > 10 ? styles.green : styles.red
              }
            >
              мест{" "}
              {freeSeats > 10
                ? "10+"
                : freeSeats}
            </p>
            {/*  */}
          </div>
          {isDetails && (
            <button className={styles.additionals} onClick={handleAdditionals}>
              <FormattedMessage id="additionals" />
            </button>
          )}
        </div>
      </div>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="single"
        unmountOnExit
        nodeRef={backdropRef}
      >
        <div ref={backdropRef} className={styles.details}>
          {tripKeys.map((el, idx) => (
            <div key={idx}>
              <h5 className={styles.routeName}>{getRouteName(el, trips)}</h5>
              <div className={styles.additionalInfo}>
                <div className={styles.depArr}>
                  <div className={styles.start}>
                    <p className={styles.timeStop}>
                      {getDate("departureDate", trips.segments[el], locale)}{" "}
                      {getTime("departureDate", trips.segments[el], lang)}
                    </p>
                    <p className={`${styles.locality} ${styles.addLocality} `}>
                      {getCity(trips.segments[el].departure.id, trips, lang)}
                    </p>
                    <p>{getStop(trips.segments[el].departure.id, trips, lang)}</p>
                    <p className={styles.address}>
                      {getAddress(trips.segments[el].departure.id, trips, lang)}
                    </p>
                  </div>
                  {arrayStops.length > 0 &&
                    arrayStops[idx].length > 0 &&
                    arrayStops[idx].map((s, i) => (
                      <div className={styles.stop} key={i}>
                        <p className={styles.timeStop}>{s.departureTime}</p>
                        <p>{getCity(s.locality.id, trips, lang)}</p>
                        <p>{getStop(s.locality.id, trips, lang)}</p>
                        <p className={styles.address}>
                          {getAddress(s.locality.id, trips, lang)}
                        </p>
                      </div>
                    ))}
                  <div className={`${styles.start} ${styles.finish}`}>
                    <p className={styles.timeStop}>
                      {getDate("arrivalDate", trips.segments[el], locale)}{" "}
                      {getTime("arrivalDate", trips.segments[el], lang)}
                    </p>
                    <p className={`${styles.locality} ${styles.addLocality} `}>
                      {getCity(trips.segments[el].arrival.id, trips, lang)}
                    </p>
                    <p>{getStop(trips.segments[el].arrival.id, trips, lang)}</p>
                    <p className={styles.addressMore}>
                      {getAddress(trips.segments[el].arrival.id, trips, lang)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CSSTransition>
    </IntlProvider>
  );
};

export default DoubleTrips;
