import React, { useRef } from "react";
import styles from "./SortTrips.module.css";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import { changeSortBoxShow, changeSortType } from "../../redux/trips/tripsActions";
import { CSSTransition } from "react-transition-group";
import "./anime.css";
import { getPrice } from "../../services/getInfo";

const SortTripsDouble = () => {
  const doubleTrips = useSelector(({ trips }) => trips.doubleTrips);
  const trips = useSelector(({ trips }) => trips.trips);
  const lang = useSelector((state) => state.language);
  const sortType = useSelector((state) => state.trips.sortType);
  const isShowSortBox = useSelector((state) => state.trips.isShowSortBox);
  const dispatch = useDispatch();
  const setSortType = (val) => dispatch(changeSortType(val));
  const changeShowSortBox = (bool) => dispatch(changeSortBoxShow(bool));
  const backdropRef = useRef(null);

  const locale = lang === "UA" ? "UK" : lang;

  const sortTimeInWay = () => {
    doubleTrips.sort((a, b) => {
      const departureMsA = new Date(
        trips.segments[a.segments[0]].departureDate
      ).getTime();
      const arrivalMsA = new Date(
        trips.segments[a.segments[a.segments.length - 1]].arrivalDate
      ).getTime();

      const departureMsB = new Date(
        trips.segments[b.segments[0]].departureDate
      ).getTime();
      const arrivalMsB = new Date(
        trips.segments[b.segments[b.segments.length - 1]].arrivalDate
      ).getTime();
      const A = arrivalMsA - departureMsA;
      const B = arrivalMsB - departureMsB;

      return A - B;
    });
  };
  const sortDepartureTime = () => {
    doubleTrips.sort((a, b) => {
      const time_partsA = trips.segments[a.segments[0]].departureDate;
      const time_partsB = trips.segments[b.segments[0]].departureDate;
      const A = new Date(time_partsA).getTime();
      const B = new Date(time_partsB).getTime();
      return A - B;
    });
  };
  const sortArrivalTime = () => {
    doubleTrips.sort((a, b) => {
      const time_partsA = trips.segments[a.segments[doubleTrips.length - 1]].arrivalDate;
      const time_partsB = trips.segments[b.segments[doubleTrips.length - 1]].arrivalDate;
      const A = new Date(time_partsA).getTime();
      const B = new Date(time_partsB).getTime();
      return A - B;
    });
  };
  const sortPrice = () => {
    doubleTrips.sort((a, b) => {
      const priceA = getPrice(a.segments, trips);
      const priceB = getPrice(b.segments, trips);
      return priceA - priceB;
    });
  };
  const handleSort = ({ target }) => {
    if (target.value === "departure") sortDepartureTime();
    if (target.value === "arrival") sortArrivalTime();
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

export default SortTripsDouble;
