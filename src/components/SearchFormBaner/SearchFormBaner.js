import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-GB";
import ua from "date-fns/locale/uk";
import pl from "date-fns/locale/pl";
import DatePicker from "react-datepicker";
import Button from "@material-ui/core/Button";
import "react-datepicker/dist/react-datepicker.css";
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
import styles from "./SearchFormBaner.module.css";
import AmountPassanger from "./AmountPassanger";
import AutoComplete from "./AutoComlete";
import { getUrl } from "../../services/getUrl";
import { CSSTransition } from "react-transition-group";
import "../../stylesheet/animation.css";

const SearchFormBaner = ({ history, scroll }) => {
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
  const searchRef = useRef(null);

  const locale = lang === "UA" ? "UK" : lang;

  // ==== данные для отображения календаря на языке пользователя ==== //
  const dateLocale = () => {
    if (lang === "EN") return en;
    if (lang === "RU") return ru;
    if (lang === "UA") return ua;
    if (lang === "PL") return pl;
  };

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
    getTime(new Date().getTime());
    //  ==== переход на страницу поездок ==== //
    history.push(
      `/${getUrl(lang).trim()}/${from.text}/${to.text}?from=${from.value}&to=${
        to.value
      }&date=${dateQuery}&passengers=${amount}`
    );
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <CSSTransition
        in={scroll}
        timeout={300}
        classNames="search"
        unmountOnExit
        nodeRef={searchRef}
      >
        <div className={styles.formContainer} ref={searchRef}>
          <form onSubmit={handleSubmit} className={`${styles.form} `}>
            <AutoComplete />
            <div className={styles.inputBox}>
              <span className={styles.dataLabel}>
                <FormattedMessage id="date" />
              </span>
              <DatePicker
                className={styles.datePicker}
                dateFormat="dd MMMM"
                selected={date}
                minDate={new Date()}
                locale={dateLocale()}
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
            </div>
            <div className={styles.inputBox}>
              <AmountPassanger />
            </div>
            <Button className={styles.searchBtn} type="submit" variant="contained">
              <FormattedMessage id="searchBtn" />
            </Button>
          </form>
        </div>
      </CSSTransition>
    </IntlProvider>
  );
};

export default SearchFormBaner;
