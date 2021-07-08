import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { format } from "date-fns";
import styles from "./DateCarousel.module.css";
import { getTodayDate, getTomorrow, getYesterday } from "../../services/getInfo";
import { startLoader } from "../../redux/global/globalActions";
import {
  inputValueDate,
  setIsOpenFrom,
  setIsOpenTo,
  setTime,
} from "../../redux/searchForm/searchFormAction";
import { getUrl } from "../../services/getUrl";
import {
  fetchTripsSuccess,
  setDoubleTrips,
  setSingleTrips,
} from "../../redux/trips/tripsActions";
import { ReactComponent as ArrowForward } from "../../images/arrow_forward_ios_white_24dp (1).svg";
import { ReactComponent as ArrowBack } from "../../images/arrow_back_ios_white_24dp (1).svg";

const DateCarousel = () => {
  const lang = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const dispatch = useDispatch();
  const loaderStart = () => dispatch(startLoader());
  const changeInputDate = (val) => dispatch(inputValueDate(val));
  const sendTime = (time) => dispatch(setTime(time));
  const sendSingleTrips = (val) => dispatch(setSingleTrips(val));
  const sendDoubleTrips = (val) => dispatch(setDoubleTrips(val));
  const setTripsSuccess = (trips) => dispatch(fetchTripsSuccess(trips));
  const sendIsOpenFrom = (trips) => dispatch(setIsOpenFrom(trips));
  const sendIsOpenTo = (trips) => dispatch(setIsOpenTo(trips));
  const history = useHistory();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const locale = lang === "UA" ? "UK" : lang;
  // ==== управление изменением даты на следующюю/предыдущую ==== //
  const changeDate = (name) => {
    if (from.text === "") {
      sendIsOpenFrom(true);
      return;
    }
    if (to.text === "") {
      sendIsOpenTo(true);
      return;
    }
    const date =
      name === "prev"
        ? new Date(parsed.date).getTime() - 24 * 60 * 60 * 1000
        : new Date(parsed.date).getTime() + 24 * 60 * 60 * 1000;
    const newDay = format(new Date(date), "yyyy-MM-dd");
    setTripsSuccess({});
    sendSingleTrips([]);
    sendDoubleTrips([]);
    loaderStart();
    changeInputDate(new Date(newDay));
    sendTime(Date.now());

    history.push(
      `/${getUrl(lang).trim()}/${from.text}/${to.text}?from=${parsed.from}&to=${
        parsed.to
      }&date=${newDay}&passengers=${parsed.passengers}`
    );
  };
  // ==== делаем кпопку предыдущей даты неактивной при сегодняшней дате ==== //
  const getDisabled = ({ date }) => {
    const yyyy = new Date().getFullYear();
    const mm = new Date().getMonth();
    const dd = new Date().getDate();
    const today = format(new Date(yyyy, mm, dd), "yyyy-MM-dd");

    if (new Date(date).getTime() <= new Date(today).getTime()) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className={styles.dateBox}>
      <ArrowBack
        className={styles.arrowBack}
        fill="var(--color-main)"
        onClick={(e) => changeDate("prev", e)}
      />
      <button
        className={styles.dateButtonBack}
        onClick={(e) => changeDate("prev", e)}
        disabled={getDisabled(parsed)}
      >
        {getYesterday(parsed, locale)}
      </button>
      <p className={styles.today}>{getTodayDate(parsed, locale)}</p>

      <button className={styles.dateButtonForward} onClick={(e) => changeDate("next", e)}>
        {getTomorrow(parsed, locale)}
      </button>
      <ArrowForward
        className={styles.arrowForward}
        fill="var(--color-main)"
        onClick={(e) => changeDate("next", e)}
      />
    </div>
  );
};

export default DateCarousel;
