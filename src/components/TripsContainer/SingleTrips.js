import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import styles from "./TripBox.module.css";
import "./TripBoxAnimation.css";
import { fetchOrderInfo } from "../../redux/order/orderActions";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import {
  getCity,
  getStop,
  getDate,
  getTime,
  getTimeInWay,
  getAddress,
} from "../../services/getInfo";

const SingleTrips = ({ tripKey, location }) => {
  const trips = useSelector((state) => state.trips.trips);
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const setOrderInfo = (obj) => dispatch(fetchOrderInfo(obj));
  const [isOpen, setIsOpen] = useState(false);
  const [arrayStops, setArrayStops] = useState([]);
  const windowWidth = window.innerWidth;
  const locale = lang === "UA" ? "UK" : lang;
  const parsed = queryString.parse(location.search);
  const backdropRef = useRef(null);

  const handleClick = () => {
    const obj = {
      from: parsed.from,
      fromStop: trips.segments[tripKey].departure.id,
      toStop: trips.segments[tripKey].arrival.id,
      to: parsed.to,
      departureDate: trips.segments[tripKey].departureDate,
      arrivalDate: trips.segments[tripKey].arrivalDate,
      price: trips.segments[tripKey].price.amount,
      priceId: trips.segments[tripKey].price.tariff.id,
      tripKey: tripKey,
    };
    setOrderInfo(obj);
    sessionStorage.setItem(
      "path",
      JSON.stringify(`${location.pathname}${location.search}`)
    );
  };
  const handleAdditionals = () => {
    // ==== определяем индекс первой остановки ====//
    const first =
      1 +
      trips.segments[tripKey].route.path.indexOf(
        trips.segments[tripKey].route.path.find(
          (el) => el.locality.id === trips.segments[tripKey].departure.id
        )
      );
    //  ==== определяем индекс последней остановки ==== //
    const last = trips.segments[tripKey].route.path.indexOf(
      trips.segments[tripKey].route.path.find(
        (el) => el.locality.id === trips.segments[tripKey].arrival.id
      )
    );

    // ==== обрезаем массив всех остановок ==== //
    const arr = trips.segments[tripKey].route.path.slice(first, last);
    // ==== записываем  в state обрезаный масив ==== //
    setArrayStops(arr);
    // ==== переключаем видимость дополнительной информации ==== //
    setIsOpen(!isOpen);
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.full}>
        <div className={styles.tripBox}>
          <p className={styles.timeInWay}>
            {getTimeInWay(trips.segments[tripKey], lang)}{" "}
            <FormattedMessage id="timeInWay" />
          </p>
          <div className={styles.fromTo}>
            <div className={styles.info}>
              <div>
                <p className={styles.time}>
                  {getTime("departureDate", trips.segments[tripKey], locale)}
                </p>
                <p className={styles.date}>
                  {getDate("departureDate", trips.segments[tripKey], locale)}
                </p>
              </div>
              <p className={styles.locality}>
                {getCity(trips.segments[tripKey].departure.id, trips, lang)}
              </p>
              <p className={styles.localityStop}>
                {getStop(trips.segments[tripKey].departure.id, trips, lang)}
              </p>
              <p className={styles.address}>
                {getAddress(trips.segments[tripKey].departure.id, trips, lang)}
              </p>
            </div>
            <div className={`${styles.info} ${styles.infoLast}`}>
              <div>
                <p className={styles.time}>
                  {getTime("arrivalDate", trips.segments[tripKey], locale)}
                </p>
                <p className={styles.date}>
                  {getDate("arrivalDate", trips.segments[tripKey], locale)}
                </p>
              </div>
              <p className={styles.locality}>
                {getCity(trips.segments[tripKey].arrival.id, trips, lang)}
              </p>
              <p className={styles.localityStop}>
                {getStop(trips.segments[tripKey].arrival.id, trips, lang)}
              </p>
              <p className={styles.address}>
                {getAddress(trips.segments[tripKey].arrival.id, trips, lang)}
              </p>
            </div>
          </div>

          <div className={styles.priceBox}>
            <p className={styles.price}>
              {trips.segments[tripKey].price.amount}{" "}
              <span>{trips.segments[tripKey].price.currency}</span>
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
            <p
              className={
                trips.segments[tripKey].freeSeatsCount > 10 ? styles.green : styles.red
              }
            >
              мест{" "}
              {trips.segments[tripKey].freeSeatsCount > 10
                ? "10+"
                : trips.segments[tripKey].freeSeatsCount}
            </p>
          </div>
          {windowWidth >= 576 ? (
            <button className={styles.additionals} onClick={handleAdditionals}>
              <FormattedMessage id="additionals" />
            </button>
          ) : null}
        </div>

        <CSSTransition
          in={isOpen}
          timeout={300}
          classNames="aler"
          unmountOnExit
          nodeRef={backdropRef}
        >
          <div ref={backdropRef}>
            <h5>{trips.segments[tripKey].route.name.EN}</h5>
            <div className={styles.additionalInfo}>
              <div className={styles.depArr}>
                <div className={styles.start}>
                  <p className={styles.timeStop}>
                    {getTime("departureDate", trips.segments[tripKey], lang)}
                  </p>
                  <p className={`${styles.locality} ${styles.addLocality} `}>
                    {getCity(trips.segments[tripKey].departure.id, trips, lang)}
                  </p>
                  <p>{getStop(trips.segments[tripKey].departure.id, trips, lang)}</p>
                  {/* <p className={styles.address}>{getAddress(trip.departure.id, trips, lang)}</p> */}
                </div>
                <div>
                  {arrayStops.map((el, idx) => (
                    <div className={styles.stop} key={idx}>
                      <p className={styles.timeStop}>{el.departureTime}</p>
                      <p>{getCity(el.locality.id, trips, lang)}</p>
                      <p>{getStop(el.locality.id, trips, lang)}</p>
                      <p className={styles.address}>
                        {getAddress(el.locality.id, trips, lang)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className={`${styles.start} ${styles.finish}`}>
                  <p className={styles.timeStop}>
                    {" "}
                    {getTime("arrivalDate", trips.segments[tripKey], lang)}
                  </p>
                  <p className={`${styles.locality} ${styles.addLocality} `}>
                    {getCity(trips.segments[tripKey].arrival.id, trips, lang)}
                  </p>
                  <p>{getStop(trips.segments[tripKey].arrival.id, trips, lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </IntlProvider>
  );
};

export default SingleTrips;
