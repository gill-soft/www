import React, { useState } from "react";
import { connect } from "react-redux";
import { format } from "date-fns";
import styles from "./TripBox.module.css";
import { Link } from "react-router-dom";
import { fetchOrderInfo } from "../../redux/order/orderActions";
import { getLang } from "../../services/getInfo";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";

const TripBox = ({ tripKey, trip, trips, fetchOrderInfo, lang, from, to, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [arrayStops, setArrayStops] = useState([]);
  const windowWidth = window.innerWidth;
  const locale = lang === "UA" ? "UK" : lang;

  const getStop = (val) => {
    const key = trip[`${val}`].id;
    return trips.localities[`${key}`]?.name[`${lang}`];
  };

  const getAllLocalities = (key) => {
    return (
      trips.localities[`${key}`].name[`${lang}`] || trips.localities[`${key}`].name[`RU`]
    );
  };

  const getTime = (key) => {
    return format(new Date(trip[`${key}`]), "HH:mm");
  };

  const getDate = (key) => {
    return new Date(trip[`${key}`]).toLocaleString(getLang(lang), {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const getTimeInWay = () => {
    let t, m;
    switch (lang) {
      case "RU":
        t = "ч";
        m = "мин";
        break;
      case "UA":
        t = "г";
        m = "хв";
        break;
      case "EN":
        t = "h";
        m = "min";
        break;
      case "PL":
        t = "g";
        m = "min";
        break;
      default:
        break;
    }
    return `${+trip.timeInWay.split(":")[0]}${t} ${trip.timeInWay.split(":")[1]}${m}`;
  };

  const getPrice = () => {
    return trip.price.amount;
  };
  const getCurrency = () => {
    return trip.price.currency;
  };

  const handleClick = () => {
    const obj = {
      from: from,
      fromStop: getStop("departure"),
      toStop: getStop("arrival"),
      to: to,
      departureDate: trip.departureDate,
      arrivalDate: trip.arrivalDate,
      price: trip.price.amount,
      priceId: trip.price.tariff.id,
      tripKey: tripKey,
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
            {getTimeInWay()} <FormattedMessage id="timeInWay" />
          </p>
          <div className={styles.fromTo}>
            <div className={styles.info}>
              <div>
                <p className={styles.time}>{getTime("departureDate")}</p>
                <p className={styles.date}>{getDate("departureDate")}</p>
              </div>
              <p className={styles.locality}>{from}</p>
              <p className={styles.localityStop}>{getStop("departure")}</p>
            </div>
            <div className={`${styles.info} ${styles.infoLast}`}>
              <div>
                <p className={styles.time}> {getTime("arrivalDate")}</p>
                <p className={styles.date}>{getDate("arrivalDate")}</p>
              </div>
              <p className={styles.locality}>{to}</p>
              <p className={styles.localityStop}>{getStop("arrival")}</p>
            </div>
          </div>

          <div className={styles.priceBox}>
            <p className={styles.price}>
              {getPrice()} <span>{getCurrency()}</span>{" "}
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
                  <p className={`${styles.locality} ${styles.addLocality} `}>{from}</p>
                  <p>{getStop("departure")}</p>
                </div>
                <div>
                  {arrayStops.map((el) => (
                    <p className={styles.stop} key={el.locality.id}>
                      {getAllLocalities(el.locality.id)}
                    </p>
                  ))}{" "}
                </div>
                <div className={`${styles.start} ${styles.finish}`}>
                  <p className={`${styles.locality} ${styles.addLocality} `}>{to}</p>
                  <p>{getStop("arrival")}</p>
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
});
const mapDispatchToProps = (dispatch) => ({
  fetchOrderInfo: (obj) => dispatch(fetchOrderInfo(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripBox);
