import React, { useRef } from "react";
import styles from "./SortTrips.module.css";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import { changeSortBoxShow, changeSortType } from "../../redux/trips/tripsActions";
import { CSSTransition } from "react-transition-group";
import "./anime.css";

const SortTrips = () => {
  const tripsInfo = useSelector((state) => state.trips.tripsInfo);
  const lang = useSelector((state) => state.language);
  const sortType = useSelector((state) => state.trips.sortType);
  const isShowSortBox = useSelector((state) => state.trips.isShowSortBox);

  const dispatch = useDispatch();
  const setSortType = (val) => dispatch(changeSortType(val));
  const changeShowSortBox = (bool) => dispatch(changeSortBoxShow(bool));

  const backdropRef = useRef(null);

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
  const handleSort = ({ target }, value) => {
    if (value === "departure") sortTime("departureDate");
    if (value === "arrival") sortTime("arrivalDate");
    if (value === "timeInWay") sortTimeInWay();
    if (value === "price") sortPrice();
    setSortType(value);
    changeShowSortBox(false);
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

  const toggleShow = () => {
    changeShowSortBox(!isShowSortBox);
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.selectBox}>
        <p className={styles.flex}>
          <FormattedMessage id="sort" />
          <button className={styles.selectValue} onClick={toggleShow}>
            {chLang(sortType)}
          </button>
        </p>

        <CSSTransition
          in={isShowSortBox}
          timeout={300}
          classNames="show"
          unmountOnExit
          nodeRef={backdropRef}
        >
          <div className={styles.optionsBox} ref={backdropRef}>
            <p onClick={(e) => handleSort(e, "price")}>{chLang("price")}</p>
            <p onClick={(e) => handleSort(e, "arrival")}>{chLang("arrival")}</p>
            <p onClick={(e) => handleSort(e, "departure")}>{chLang("departure")}</p>
            <p onClick={(e) => handleSort(e, "timeInWay")}>{chLang("timeInWay")}</p>
          </div>
        </CSSTransition>
      </div>
    </IntlProvider>
  );
};

export default SortTrips;
