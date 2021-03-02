import React from "react";
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
import { messages } from "../../intl/HomePageMessanges";
import { inputValueDate, setTime } from "../../redux/searchForm/searchFormAction";
import { fetchTripsSuccess } from "../../redux/trips/tripsActions";
import { getError, startLoader } from "../../redux/global/globalActions";
import styles from "./SearchForm.module.css";
import AmountPassanger from "./AmountPassanger";
import AutoComplete3 from "./AutoComlete3";

const SearchForm = ({ history }) => {
  const lang = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const date = useSelector((state) => state.searchForm.date);
  const amount = useSelector((state) => state.searchForm.amountPassanger);

  const dispatch = useDispatch();
  const setData = (date) => dispatch(inputValueDate(date));
  const setTripsSuccess = (trips) => dispatch(fetchTripsSuccess(trips));
  const setError = (err) => dispatch(getError(err));
  const loaderStart = () => dispatch(startLoader());
  const getTime = (time) => dispatch(setTime(time));

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
    if (!from.text) {
      return;
    }
    if (!to.text) {
      return;
    }
    const dateQuery = format(new Date(date), "yyyy-MM-dd");
    // ==== запускаем лоадер, очищаем ошибки и данные предыдущего запроса ==== //
    setError("");
    setTripsSuccess({});
    loaderStart();
    getTime(new Date().getTime());
    //  ==== переход на страницу поездок ==== //
    history.push(
      `/trips?from=${from.value}&to=${to.value}&date=${dateQuery}&passengers=${amount}`
    );
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <form onSubmit={handleSubmit} className={`${styles.form} `}>
        <div className={styles.fromTo}>
          <AutoComplete3 />
        </div>
        <div className={styles.flex}>
          <div className={styles.inputBox}>
            <DatePicker
              className={styles.datePicker}
              dateFormat="dd MMMM yyyy"
              selected={date}
              minDate={new Date()}
              locale={dateLocale()}
              onChange={(date) => setData(date)}
            />
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
