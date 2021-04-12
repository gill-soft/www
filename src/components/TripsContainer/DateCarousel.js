import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DateCarousel.module.css";
import { getTodayDate, getTomorrow, getYesterday } from "../../services/getInfo";
import { format } from "date-fns";
import { startLoader } from "../../redux/global/globalActions";
import { inputValueDate, setTime } from "../../redux/searchForm/searchFormAction";
import { getUrl } from "../../services/getUrl";

const DateCarousel = ({ parsed, history }) => {
  const lang = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const dispatch = useDispatch();
  const loaderStart = () => dispatch(startLoader());
  const changeInputDate = (val) => dispatch(inputValueDate(val));
  const sendTime = (time) => dispatch(setTime(time));


  // ==== управление изменением даты на следующюю/предыдущую ==== //
  const changeDate = ({ target }) => {
    const date =
      target.name === "prev"
        ? new Date(parsed.date).getTime() - 24 * 60 * 60 * 1000
        : new Date(parsed.date).getTime() + 24 * 60 * 60 * 1000;
    const newDay = format(new Date(date), "yyyy-MM-dd");
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
