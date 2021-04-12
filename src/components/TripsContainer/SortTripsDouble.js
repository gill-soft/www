import React, { useRef } from "react";
import styles from "./SortTrips.module.css";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import {  changeSortBoxShowDouble, changeSortType } from "../../redux/trips/tripsActions";
import { CSSTransition } from "react-transition-group";
import "./anime.css";
import { getPrice } from "../../services/getInfo";

const SortTripsDouble = () => {
  const doubleTrips = useSelector(({ trips }) => trips.doubleTrips);
  const trips = useSelector(({ trips }) => trips.trips);
  const lang = useSelector((state) => state.language);
  const sortType = useSelector((state) => state.trips.sortType);
  const isShowSortBoxDouble = useSelector((state) => state.trips.isShowSortBoxDouble);
  const dispatch = useDispatch();
  const setSortType = (val) => dispatch(changeSortType(val));
  const changeShowSortBoxDouble = (bool) => dispatch(changeSortBoxShowDouble(bool));
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
  const handleSort = (value) => {
    if (value === "departure") sortDepartureTime();
    if (value === "arrival") sortArrivalTime();
    if (value === "timeInWay") sortTimeInWay();
    if (value === "price") sortPrice();
    setSortType(value);
    changeShowSortBoxDouble(false);
  };
  const buttonTitle = (sortType) => {
    if (sortType === "price") return <FormattedMessage id="sortPrice" />;
    if (sortType === "arrival") return <FormattedMessage id="sortArrival" />;
    if (sortType === "departure") return <FormattedMessage id="sortDeparture" />;
    if (sortType === "timeInWay") return <FormattedMessage id="sortTime" />;
  };

  const toggleShow = () => {
    changeShowSortBoxDouble(!isShowSortBoxDouble);
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.selectBox}>
        <p className={styles.flex}>
          <FormattedMessage id="sort" />
          <button className={styles.selectValue} onClick={toggleShow}>
            {buttonTitle(sortType)}
          </button>
        </p>

        <CSSTransition
          in={isShowSortBoxDouble}
          timeout={300}
          classNames="show"
          unmountOnExit
          nodeRef={backdropRef}
        >
          <div className={styles.optionsBox} ref={backdropRef}>
            <p onClick={() => handleSort("price")}>
              <FormattedMessage id="sortPrice" />
            </p>
            <p onClick={() => handleSort("arrival")}>
              <FormattedMessage id="sortArrival" />
            </p>
            <p onClick={() => handleSort("departure")}>
              <FormattedMessage id="sortDeparture" />
            </p>
            <p onClick={() => handleSort("timeInWay")}>
              <FormattedMessage id="sortTime" />
            </p>
          </div>
        </CSSTransition>
      </div>
    </IntlProvider>
  );
};

export default SortTripsDouble;
