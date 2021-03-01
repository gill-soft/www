import React, { Component } from "react";
import { connect } from "react-redux";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-GB";
import ua from "date-fns/locale/uk";
import pl from "date-fns/locale/pl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessanges";
import Button from "@material-ui/core/Button";
import {
  inputValueFrom,
  inputValueTo,
  inputValueDate,
  setTime,
  setFromId,
  setToId,
} from "../../redux/searchForm/searchFormAction";
import { fetchTripsSuccess } from "../../redux/trips/tripsActions";
import { getError, startLoader } from "../../redux/global/globalActions";
import styles from "./SearchForm.module.css";
// import AutocompleteComp from "./Autocomplete";
import Autocomplete2 from "./Autocomplete2";

import AmountPassanger from "./AmountPassanger";
import { ReactComponent as Arrow } from "../../images/sync_alt-white-36dp.svg";

class SearchForm extends Component {
  state = {
    errorFrom: false,
    errorTo: false,
  };

  // ====
  componentDidUpdate(prevProps) {
    const { from, to } = this.props;
    if (prevProps.from !== from) {
      if (from) {
        this.setState({ errorFrom: false });
      }
    }
    if (prevProps.to !== to) {
      if (to) {
        this.setState({ errorTo: false });
      }
    }
  }

  // ==== поменять отправку и прибытие местами ==== //
  changeButton = () => {
    const {
      changeInputFrom,
      setToId,
      setFromId,
      changeInputTo,
      from,
      to,
      fromID,
      toID,
    } = this.props;
    const fromInp = from;
    const fromId = fromID;
    const toInp = to;
    const toId = toID;
    changeInputFrom(toInp);
    setFromId(toId);
    changeInputTo(fromInp);
    setToId(fromId);
  };

  // ==== данные для отображения календаря на языке пользователя ==== //
  dateLocale = () => {
    const { lang } = this.props;
    if (lang === "EN") return en;
    if (lang === "RU") return ru;
    if (lang === "UA") return ua;
    if (lang === "PL") return pl;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      to,
      date,
      toID,
      from,
      fromID,
      amount,
      history,
      setTime,
      getError,
      startLoader,
      fetchTripsSuccess,
    } = this.props;

    // ==== формируем данные для запроса ==== //
    const fromId = fromID ? fromID : this.getId(from, "from");
    const toId = toID ? toID : this.getId(to, "to");
    const dateQuery = format(new Date(date), "yyyy-MM-dd");

    // ==== проверяем есть ли введенные города в списке остановок ==== //
    if (fromId && toId) {
      // ==== запускаем лоадер, очищаем ошибки и данные предыдущего запроса ==== //
      getError("");
      fetchTripsSuccess({});
      startLoader();
      setTime(new Date().getTime());
      //  ==== переход на страницу поездок ==== //
      history.push(
        `/trips?from=${fromId}&to=${toId}&date=${dateQuery}&passengers=${amount}`
      );
    }
  };

  getId = (val, type) => {
    const { lang, stops } = this.props;
    const result = stops.find((item) =>
      item.type === "LOCALITY"
        ? (item.name[`${lang}`] || item.name["EN"]).toLowerCase() ===
          val.toLowerCase().trim()
        : null
    );
    if (result) {
      return result.id;
    } else {
      type === "from"
        ? this.setState({ errorFrom: true })
        : this.setState({ errorTo: true });
      return;
    }
  };

  render() {
    const { date, changeInputDate, lang } = this.props;
    const locale = lang === "UA" ? "UK" : lang;
    return (
      <form onSubmit={this.handleSubmit} className={`${styles.form} `}>
        <div className={styles.fromTo}>
          <div className={styles.inputBox}>
            {/* <AutocompleteComp id="from" error={this.state.errorFrom} /> */}
            <Autocomplete2 id="from" error={this.state.errorFrom} />
          </div>
          <Arrow className={styles.arrow} onClick={this.changeButton} />
          <div className={styles.inputBox}>
            {/* <AutocompleteComp id="to" error={this.state.errorTo} /> */}
            <Autocomplete2 id="to" error={this.state.errorTo} />
          </div>
        </div>
        <div className={styles.flex}>
          <div className={styles.inputBox}>
            <DatePicker
              className={styles.datePicker}
              dateFormat="dd MMMM yyyy"
              selected={date}
              minDate={new Date()}
              locale={this.dateLocale()}
              onChange={(date) => changeInputDate(date)}
            />
          </div>
          <div className={styles.inputBox}>
            <AmountPassanger onClose={this.closeModal} />
          </div>
        </div>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <Button
            className={styles.searchBtn}
            type="submit"
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="searchBtn" />
          </Button>
        </IntlProvider>
      </form>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.language,
  from: state.searchForm.from,
  fromID: state.searchForm.fromID,
  to: state.searchForm.to,
  toID: state.searchForm.toID,
  date: state.searchForm.date,
  amount: state.searchForm.amountPassanger,
  stops: state.global.stops,
});
const mapDispatchToProps = (dispatch) => ({
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  setFromId: (value) => dispatch(setFromId(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
  setToId: (value) => dispatch(setToId(value)),
  changeInputDate: (date) => dispatch(inputValueDate(date)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  getError: (err) => dispatch(getError(err)),
  startLoader: () => dispatch(startLoader()),
  setTime: (time) => dispatch(setTime(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
