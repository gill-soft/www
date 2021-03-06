import React from "react";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@material-ui/core/Button";
import { format } from "date-fns";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessages";
import {
  inputValueDate,
  setIsOpenDate,
  setIsOpenFrom,
  setIsOpenTo,
  setTime,
} from "../../redux/searchForm/searchFormAction";

import { getError, startLoader } from "../../redux/global/globalActions";
import styles from "./SearchForm.module.css";
import AmountPassanger from "./AmountPassanger";
import AutoComplete from "./AutoComlete";
import { getUrl } from "../../services/getUrl";
import { dateLocale } from "../../services/dateFormat";

const SearchForm = ({ history, scroll = false }) => {
  const lang = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const date = useSelector((state) => state.searchForm.date);
  const amount = useSelector((state) => state.searchForm.amountPassanger);
  const isOpenDate = useSelector((state) => state.searchForm.isOpenDate);

  const dispatch = useDispatch();
  const setData = (date) => dispatch(inputValueDate(date));

  const setError = (err) => dispatch(getError(err));
  const loaderStart = () => dispatch(startLoader());
  const getTime = (time) => dispatch(setTime(time));
  const changeIsOpenFrom = (bool) => dispatch(setIsOpenFrom(bool));
  const changeIsOpenTo = (bool) => dispatch(setIsOpenTo(bool));
  const changeIsOpenDate = (bool) => dispatch(setIsOpenDate(bool));

  const locale = lang === "UA" ? "UK" : lang;
  const windowWidth = window.innerWidth;

  const handleSubmit = (e) => {
    e.preventDefault();
    changeIsOpenFrom(false);
    changeIsOpenTo(false);
    changeIsOpenDate(false);
    if (from === null || !from?.text) {
      changeIsOpenFrom(true);
      return;
    }
    if (to === null || !to?.text) {
      changeIsOpenTo(true);
      return;
    }
    const dateQuery = format(new Date(date), "yyyy-MM-dd");
    // ==== запускаем лоадер, очищаем ошибки и данные предыдущего запроса ==== //
    setError("");
    loaderStart();
    getTime(Date.now());
    //  ==== переход на страницу поездок ==== //
    history.push(
      `/${getUrl(lang).trim()}/${from.text}/${to.text}?from=${from.value}&to=${
        to.value
      }&date=${dateQuery}&passengers=${amount}`
    );
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <form onSubmit={handleSubmit} className={`${styles.form} `}>
        <div className={styles.fromTo}>
          {(!scroll || windowWidth < 768) && <AutoComplete />}
        </div>
        <div className={styles.flex}>
          <div className={styles.inputBox}>
            {(!scroll || windowWidth < 768) && (
              <DatePicker
                className={styles.datePicker}
                dateFormat="dd MMMM"
                selected={date}
                minDate={new Date()}
                locale={dateLocale(lang)}
                onChange={(date) => {
                  setData(date);
                  changeIsOpenDate(false);
                }}
                onClickOutside={() => changeIsOpenDate(false)}
                onFocus={() => {
                  changeIsOpenDate(true);
                  changeIsOpenFrom(false);
                  changeIsOpenTo(false);
                }}
                open={isOpenDate}
              />
            )}
          </div>
          <div className={styles.inputBox}>
            <AmountPassanger />
          </div>
        </div>
        <Button className={styles.searchBtn} type="submit" variant="contained">
          <FormattedMessage id="searchBtn" />
        </Button>
      </form>
    </IntlProvider>
  );
};

export default SearchForm;
