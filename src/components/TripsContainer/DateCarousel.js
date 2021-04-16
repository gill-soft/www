import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DateCarousel.module.css";
import { getTodayDate, getTomorrow, getYesterday } from "../../services/getInfo";
import { format } from "date-fns";
import { startLoader } from "../../redux/global/globalActions";
import { inputValueDate, setTime } from "../../redux/searchForm/searchFormAction";
import { getUrl } from "../../services/getUrl";
import { fetchTripsSuccess, setDoubleTrips, setSingleTrips } from "../../redux/trips/tripsActions";

const DateCarousel = ({ parsed, history }) => {
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

  const locale = lang === "UA" ? "UK" : lang;

  // ==== управление изменением даты на следующюю/предыдущую ==== //
  const changeDate = ({ target }) => {
    const date =
      target.name === "prev"
        ? new Date(parsed.date).getTime() - 24 * 60 * 60 * 1000
        : new Date(parsed.date).getTime() + 24 * 60 * 60 * 1000;
    const newDay = format(new Date(date), "yyyy-MM-dd");
    setTripsSuccess({})
    sendSingleTrips([]);
    sendDoubleTrips([]);
    loaderStart();
    changeInputDate(new Date(newDay));
    sendTime(new Date().getTime());

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
      <button
        className={styles.dateButton}
        name="prev"
        onClick={changeDate}
        disabled={getDisabled(parsed)}
      >
        {getYesterday(parsed, locale)}
      </button>
      <p className={styles.today}>{getTodayDate(parsed, locale)}</p>
      <button className={styles.dateButton} name="next" onClick={changeDate}>
        {getTomorrow(parsed, locale)}
      </button>
    </div>
  );
};

export default DateCarousel;
