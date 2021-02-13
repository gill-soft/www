import React, { Component } from "react";
import { connect } from "react-redux";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-GB";
import ua from "date-fns/locale/uk";
import pl from "date-fns/locale/pl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import queryString from "query-string";

import Button from "@material-ui/core/Button";
import {
  inputValueFrom,
  inputValueTo,
  inputValueDate,
} from "../../redux/searchForm/searchFormAction";
import { fetchTripsSuccess } from "../../redux/trips/tripsActions";
import { getError, startLoader, stopLoader } from "../../redux/global/globalActions";
import styles from "./SearchForm.module.css";
import AutocompleteComp from "./Autocomplete";
import AmountPassanger from "./AmountPassanger";
import { ReactComponent as Arrow } from "../../images/sync_alt-white-36dp.svg";

class SearchForm extends Component {
  state = {
    errorFrom: false,
    errorTo: false,
  };
  windowWidth = window.innerWidth;

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
    const { changeInputFrom, changeInputTo, from, to } = this.props;
    const fromInp = from;
    const toInp = to;
    changeInputFrom(toInp);
    changeInputTo(fromInp);
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
      from,
      date,
      amount,
      history,
      getError,
      startLoader,
      fetchTripsSuccess,
    } = this.props;
    const parsed = queryString.parse(history.location.search);
    // ==== проверка на не пустой инпут ==== //
    if (!from) {
      this.setState({ errorFrom: true });
      return;
    }
    if (!to) {
      this.setState({ errorTo: true });
      return;
    }

    // ==== формируем данные для запроса ==== //
    const fromId = this.getId(from, "from");
    const toId = this.getId(to, "to");
    const dateQuery = format(new Date(date), "yyyy-MM-dd");

    // ==== проверяем есть ли введенные города в списке остановок ==== //
    if (fromId && toId) {
      //  ==== если строка запроса не изменилась - выходим ==== //
      if (
        parsed.from === fromId &&
        parsed.to === toId &&
        parsed.date === dateQuery &&
        +parsed.passengers === amount
      )
        return;

      // ==== запускаем лоадер, очищаем ошибки и данные предыдущего запроса ==== //
      getError("");
      fetchTripsSuccess({});
      startLoader();

      //  ==== переход на страницу поездок ==== //
      history.push(
        `/trips?from=${fromId}&to=${toId}&date=${dateQuery}&passengers=${amount}`
      );
    }
  };

  getId = (val, inp) => {
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
      inp === "from"
        ? this.setState({ errorFrom: true })
        : this.setState({ errorTo: true });
      return;
    }
  };

  render() {
    const { date, changeInputDate } = this.props;
    return (
      // <div className={`${styles.searchForm}`}>
      <form onSubmit={this.handleSubmit} className={`${styles.form} `}>
        <div className={styles.fromTo}>
          <div className={styles.inputBox}>
            <AutocompleteComp id="from" error={this.state.errorFrom} />
          </div>
          <Arrow className={styles.arrow} onClick={this.changeButton} />
          <div className={styles.inputBox}>
            <AutocompleteComp id="to" error={this.state.errorTo} />
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

        <Button
          className={styles.searchBtn}
          type="submit"
          variant="contained"
          color="primary"
        >
          Поиск
        </Button>
      </form>
      // </div>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.language,
  from: state.searchForm.from,
  to: state.searchForm.to,
  date: state.searchForm.date,
  amount: state.searchForm.amountPassanger,
  stops: state.global.stops,
  error: state.global.error,
});
const mapDispatchToProps = (dispatch) => ({
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
  changeInputDate: (date) => dispatch(inputValueDate(date)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  getError: (err) => dispatch(getError(err)),
  startLoader: () => dispatch(startLoader()),
  stopLoader: () => dispatch(stopLoader()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
