import React from "react";
import styles from "./SortTrips.module.css";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import {  changeSortTypeSingle } from "../../redux/trips/tripsActions";

const SortTripsSingleMob = () => {
  const singleTrips = useSelector(({ trips }) => trips.singleTrips);
  const trips = useSelector(({ trips }) => trips.trips);
  const lang = useSelector((state) => state.language);
  const sortType = useSelector((state) => state.trips.sortTypeSingle);
  const dispatch = useDispatch();
  const setSortType = (val) => dispatch(changeSortTypeSingle(val));

  const locale = lang === "UA" ? "UK" : lang;

  const sortTimeInWay = () => {
    singleTrips.sort((a, b) => {
      const time_partsA = trips.segments[a.id].timeInWay.split(":");
      const time_partsB = trips.segments[b.id].timeInWay.split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];
      return A - B;
    });
  };
  const sortTime = (key) => {
    singleTrips.sort((a, b) => {
      const time_partsA = trips.segments[a.id][key];
      const time_partsB = trips.segments[b.id][key];
      const A = new Date(time_partsA).getTime();
      const B = new Date(time_partsB).getTime();
      return A - B;
    });
  };
  const sortPrice = () => {
    singleTrips.sort((a, b) => {
      const A = trips.segments[a.id].price.amount;
      const B = trips.segments[b.id].price.amount;
      return A - B;
    });
  };
  const handleSort = ({ target }) => {
    if (target.value === "departure") sortTime("departureDate");
    if (target.value === "arrival") sortTime("arrivalDate");
    if (target.value === "timeInWay") sortTimeInWay();
    if (target.value === "price") sortPrice();
    setSortType(target.value);
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
    if (name === "timeInWay") return time;
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.selectBox}>
        <label>
          <FormattedMessage id="sort" />{" "}
          <select
            className={styles.select}
            name="sort"
            value={sortType}
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
              {chLang("timeInWay")}
            </option>
          </select>
        </label>
      </div>
    </IntlProvider>
  );
};

export default SortTripsSingleMob;
