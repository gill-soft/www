import React from "react";
import styles from "./SortTrips.module.css";
import { connect } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";

const SortTrips = ({ tripsInfo, onChangeValue, value, lang }) => {
  const locale = lang === "UA" ? "UK" : lang;

  const sortTimeInWay = () => {
    tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`].timeInWay.split(":");
      const time_partsB = b[`${Object.keys(b)}`].timeInWay.split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];
      return A - B;
    });
  };
  const sortTime = (key) => {
    tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`][`${key}`].split(" ")[1].split(":");
      const time_partsB = b[`${Object.keys(b)}`][`${key}`].split(" ")[1].split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];
      return A - B;
    });
  };
  const sortPrice = () => {
    tripsInfo.sort((a, b) => {
      const A = a[`${Object.keys(a)}`].price.amount;
      const B = b[`${Object.keys(b)}`].price.amount;
      return A - B;
    });
  };
  const handleSort = ({ target }) => {
    if (target.value === "departure") sortTime("departureDate");
    if (target.value === "arrival") sortTime("arrivalDate");
    if (target.value === "timeInWay") sortTimeInWay();
    if (target.value === "price") sortPrice();
    onChangeValue(target.value);
  };
  const chLang = (name) => {
    let price, arrival, departure, time;
    switch (lang) {
      case "RU":
        price = "цене";
        arrival = "времени прибытия";
        departure = "времени отправления";
        time = "времени в пути";
        break;
      case "UA":
        price = "ціною";
        arrival = "часом прибуття";
        departure = "часом відправлення";
        time = "часом в дорозі";
        break;
      case "EN":
        price = "price";
        arrival = "arrival time";
        departure = "departure time";
        time = "travel time";
        break;
      case "PL":
        price = "ceny";
        arrival = "czasu przybycia";
        departure = "czasu odjazdu";
        time = "czasu podróży";
        break;
      default:
        break;
    }
    if (name === "price") return price;
    if (name === "arrival") return arrival;
    if (name === "departure") return departure;
    if (name === "time") return time;
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.selectBox}>
        <label>
          <FormattedMessage id="sort" />{" "}
          <select
            className={styles.select}
            name="sort"
            value={value}
            onChange={handleSort}
          >
            <option className={styles.option} value="price">
              {chLang("price")}
            </option>
            <option className={styles.option} value="departure">
              {chLang("departure")}
            </option>
            <option className={styles.option} value="arrival">
              {chLang("arrival")}
            </option>
            <option className={styles.option} value="timeInWay">
              {chLang("time")}
            </option>
          </select>
        </label>
      </div>
    </IntlProvider>
  );
};
const mapStateToProps = (state) => ({
  tripsInfo: state.trips.tripsInfo,
  lang: state.language,
});

export default connect(mapStateToProps)(SortTrips);
