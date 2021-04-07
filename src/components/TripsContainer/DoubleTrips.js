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
  getTimeInWayDouble,
  getAddress,
  getPrice,
} from "../../services/getInfo";

const DoubleTrips = ({ tripKeys, location }) => {
  const trips = useSelector((state) => state.trips.trips);
  const lang = useSelector((state) => state.language);
  const stops = useSelector((state) => state.global.stops);
  const dispatch = useDispatch();
  const setOrderInfo = (obj) => dispatch(fetchOrderInfo(obj));
  const [isOpen, setIsOpen] = useState(false);
  const [arrayStops, setArrayStops] = useState([]);
  const windowWidth = window.innerWidth;
  const locale = lang === "UA" ? "UK" : lang;
  const backdropRef = useRef(null);
  const lastKey = tripKeys[tripKeys.length - 1];

  useEffect(() => {
    const www = tripKeys.map((el) => {
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
    setArrayStops(www);
  }, []);

  const handleClick = () => {
    const obj = {
      //   from: parsed.from,
      //   fromStop: trips.segments[tripKey].departure.id,
      //   toStop: trips.segments[tripKey].arrival.id,
      //   to: parsed.to,
      //   departureDate: trips.segments[tripKey].departureDate,
      //   arrivalDate: trips.segments[tripKey].arrivalDate,
      //   price: trips.segments[tripKey].price.amount,
      //   priceId: trips.segments[tripKey].price.tariff.id,
      //   tripKey: tripKey,
    };
  };
  const handleAdditionals = () => {
    // // ==== определяем индекс первой остановки ====//
    // const first =
    //   1 +
    //   trips.segments[tripKeys[0]].route.path.indexOf(
    //     trips.segments[tripKeys[0]].route.path.find(
    //       (el) => el.locality.id === trips.segments[tripKeys[0]].departure.id
    //     )
    //   );
    // //  ==== определяем индекс последней остановки ==== //
    // const last = trips.segments[tripKeys[0]].route.path.indexOf(
    //   trips.segments[tripKeys[0]].route.path.find(
    //     (el) => el.locality.id === trips.segments[tripKeys[0]].arrival.id
    //   )
    // );

    // // ==== обрезаем массив всех остановок ==== //
    // const arr = trips.segments[tripKeys[0]].route.path.slice(first, last);
    // // ==== записываем  в state обрезаный масив ==== //
    // setArrayStops(arr);
    // ==== переключаем видимость дополнительной информации ==== //
    setIsOpen(!isOpen);
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.full}>
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
              {getPrice(tripKeys, trips)}
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
          </div>
          {windowWidth >= 576 ? (
            <button className={styles.additionals} onClick={handleAdditionals}>
              <FormattedMessage id="additionals" />
            </button>
          ) : null}
        </div>

        {tripKeys.map((el, idx) => (
          <div ref={backdropRef} key={idx}>
            <h5>{trips.segments[el].route.name.EN}</h5>
            <div className={styles.additionalInfo}>
              <div className={styles.depArr}>
                <div className={styles.start}>
                  <p className={styles.timeStop}>
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
                <div>
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
                </div>
                <div className={`${styles.start} ${styles.finish}`}>
                  <p className={styles.timeStop}>
                    {" "}
                    {getTime("arrivalDate", trips.segments[el], lang)}
                  </p>
                  <p className={`${styles.locality} ${styles.addLocality} `}>
                    {getCity(trips.segments[el].arrival.id, trips, lang)}
                  </p>
                  <p>{getStop(trips.segments[el].arrival.id, trips, lang)}</p>
                  <p className={styles.address}>
                    {getAddress(trips.segments[el].arrival.id, trips, lang)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </IntlProvider>
  );
};

export default DoubleTrips;
