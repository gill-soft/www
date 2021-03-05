import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DateCarousel.module.css"
import { getTodayDate, getTomorrow, getYesterday } from "../../services/getInfo";
import { format } from "date-fns";
import { startLoader } from "../../redux/global/globalActions";
import { inputValueDate, setTime } from "../../redux/searchForm/searchFormAction";
import { getTripsInfo } from "../../redux/trips/tripsActions";

const DateCarousel = ({ parsed, history }) => {
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const loaderStart = () => dispatch(startLoader());
  const changeInputDate = (val) => dispatch(inputValueDate(val));
  const timeSet = (time) => dispatch(setTime(time));
  const setTripsInfo = (obj) => dispatch(getTripsInfo(obj));

  // ==== управление изменением даты на следующюю/предыдущую ==== //
  const changeDate = ({ target }) => {
    const newDay =
      target.name === "prev"
        ? format(
            new Date(new Date(parsed.date).getTime() - 24 * 60 * 60 * 1000),
            "yyyy-MM-dd"
          )
        : format(
            new Date(new Date(parsed.date).getTime() + 24 * 60 * 60 * 1000),
            "yyyy-MM-dd"
          );
    loaderStart();
    changeInputDate(new Date(newDay));
    timeSet(new Date().getTime());
    setTripsInfo({});
    history.push(
      `/trips?from=${parsed.from}&to=${parsed.to}&date=${newDay}&passengers=${parsed.passengers}`
    );
  };
  // ==== делаем кпопку предыдущей даты неактивной при сегодняшней дате ==== //
  const getDisabled = ({ date }) => {
    const yyyy = new Date().getFullYear();
    const mm = new Date().getMonth();
    const dd = new Date().getDate();
    if (new Date(date).getTime() - 7200000 <= new Date(yyyy, mm, dd).getTime()) {
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
        {getYesterday(parsed, lang)}
      </button>
      <p className={styles.today}>{getTodayDate(parsed, lang)}</p>
      <button className={styles.dateButton} name="next" onClick={changeDate}>
        {getTomorrow(parsed, lang)}
      </button>
    </div>
  );
};

export default DateCarousel;
