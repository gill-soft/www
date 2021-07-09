import React, { useRef } from "react";
import styles from "./SortTrips.module.css";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";
import { changeSortBoxShow, changeSortTypeSingle } from "../../redux/trips/tripsActions";
import { CSSTransition } from "react-transition-group";
import "../../stylesheet/animation.css";
import { getSingleTrips, getTrips } from "../../redux/trips/tripsSelectors";

const SortTripsSingle = () => {
  const singleTrips = useSelector((state) => getSingleTrips(state));
  const trips = useSelector((state) => getTrips(state));
  const lang = useSelector((state) => state.language);
  const sortType = useSelector((state) => state.trips.sortTypeSingle);
  const isShowSortBox = useSelector((state) => state.trips.isShowSortBox);
  const dispatch = useDispatch();
  const setSortType = (val) => dispatch(changeSortTypeSingle(val));
  const changeShowSortBox = (bool) => dispatch(changeSortBoxShow(bool));
  const backdropRef = useRef(null);

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
  const handleSort = (value) => {
    if (value === "departure") sortTime("departureDate");
    if (value === "arrival") sortTime("arrivalDate");
    if (value === "timeInWay") sortTimeInWay();
    if (value === "price") sortPrice();
    setSortType(value);
    changeShowSortBox(false);
  };
  const buttonTitle = (sortType) => {
    if (sortType === "price") return <FormattedMessage id="sortPrice" />;
    if (sortType === "arrival") return <FormattedMessage id="sortArrival" />;
    if (sortType === "departure") return <FormattedMessage id="sortDeparture" />;
    if (sortType === "timeInWay") return <FormattedMessage id="sortTime" />;
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
            {buttonTitle(sortType)}
          </button>
        </p>
        <CSSTransition
          in={isShowSortBox}
          timeout={300}
          classNames="sort"
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

export default SortTripsSingle;
