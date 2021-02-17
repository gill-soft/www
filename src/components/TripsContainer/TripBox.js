import React, { useState } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import styles from "./TripBox.module.css";
import { Link } from "react-router-dom";
import { fetchOrderInfo } from "../../redux/order/orderActions";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import {
  getLocality,
  getStop,
  getDate,
  getTime,
  getTimeInWay,
  getAllLocalities,
} from "../../services/getInfo";

const TripBox = ({ tripKey, trip, trips, fetchOrderInfo, lang, location, stops }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [arrayStops, setArrayStops] = useState([]);
  const windowWidth = window.innerWidth;
  const locale = lang === "UA" ? "UK" : lang;
  const parsed = queryString.parse(location.search);

  const handleClick = () => {
    const obj = {
      from: parsed.from,
      fromStop: trip.departure.id,
      toStop: trip.arrival.id,
      to: parsed.to,
      departureDate: trip.departureDate,
      arrivalDate: trip.arrivalDate,
      price: trip.price.amount,
      priceId: trip.price.tariff.id,
      tripKey: tripKey[0],
    };
    fetchOrderInfo(obj);
    sessionStorage.setItem(
      "path",
      JSON.stringify(`${location.pathname}${location.search}`)
    );
  };

  const handleAdditionals = () => {
    // ==== определяем индекс первой остановки ====//
    const first =
      1 +
      trip.route.path.indexOf(
        trip.route.path.find((el) => el.locality.id === trip.departure.id)
      );
    //  ==== определяем индекс последней остановки ==== //
    const last = trip.route.path.indexOf(
      trip.route.path.find((el) => el.locality.id === trip.arrival.id)
    );

    // ==== обрезаем массив всех остановок ==== //
    const arr = trip.route.path.slice(first, last);
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
            {getTimeInWay(trip, lang)} <FormattedMessage id="timeInWay" />
          </p>
          <div className={styles.fromTo}>
            <div className={styles.info}>
              <div>
                <p className={styles.time}>{getTime("departureDate", trip, lang)}</p>
                <p className={styles.date}>{getDate("departureDate", trip, lang)}</p>
              </div>
              <p className={styles.locality}>{getLocality(parsed.from, stops, lang)}</p>
              <p className={styles.localityStop}>
                {getStop(trip.departure.id, trips, lang)}
              </p>
            </div>
            <div className={`${styles.info} ${styles.infoLast}`}>
              <div>
                <p className={styles.time}> {getTime("arrivalDate", trip, lang)}</p>
                <p className={styles.date}>{getDate("arrivalDate", trip, lang)}</p>
              </div>
              <p className={styles.locality}>{getLocality(parsed.to, stops, lang)}</p>
              <p className={styles.localityStop}>
                {getStop(trip.arrival.id, trips, lang)}
              </p>
            </div>
          </div>

          <div className={styles.priceBox}>
            <p className={styles.price}>
              {trip.price.amount} <span>{trip.price.currency}</span>{" "}
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
        {isOpen && (
          <>
            <h5>{trip.route.name.EN}</h5>
            <div className={styles.additionalInfo}>
              <div className={styles.depArr}>
                <p className={styles.departure}>
                  <FormattedMessage id="departure" />
                </p>
                <p className={styles.arrival}>
                  <FormattedMessage id="arrival" />
                </p>
              </div>
              <div>
                <div className={styles.start}>
                  <p className={`${styles.locality} ${styles.addLocality} `}>
                    {getLocality(parsed.from, stops, lang)}
                  </p>
                  <p>{getStop(trip.departure.id, trips, lang)}</p>
                </div>
                <div>
                  {arrayStops.map((el) => (
                    <p className={styles.stop} key={el.locality.id}>
                      {getAllLocalities(el.locality.id, trips, lang)}
                    </p>
                  ))}{" "}
                </div>
                <div className={`${styles.start} ${styles.finish}`}>
                  <p className={`${styles.locality} ${styles.addLocality} `}>
                    {getLocality(parsed.to, stops, lang)}
                  </p>
                  <p>{getStop(trip.arrival.id, trips, lang)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </IntlProvider>
  );
};
const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  lang: state.language,
  stops: state.global.stops,
});
const mapDispatchToProps = (dispatch) => ({
  fetchOrderInfo: (obj) => dispatch(fetchOrderInfo(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripBox);
