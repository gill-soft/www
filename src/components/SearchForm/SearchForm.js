import React, { Component } from "react";
import { connect } from "react-redux";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-GB";
import ua from "date-fns/locale/uk";
import pl from "date-fns/locale/pl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Button from "@material-ui/core/Button";
import {
  inputValueFrom,
  inputValueTo,
  inputValueDate,
} from "../../redux/searchForm/searchFormAction";
import { fetchTripsSuccess } from "../../redux/trips/tripsActions";
import styles from "./SearchForm.module.css";
import AutocompleteComp from "./Autocomplete";
import { ReactComponent as Arrow } from "../../images/sync_alt-white-36dp.svg";
import AmountPassanger from "./AmountPassanger";
import { getError, startLoader } from "../../redux/global/globalActions";

class SearchForm extends Component {
  state = {
    errorFrom: false,
    errorTo: false,
  };

  // ====
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.from !== this.props.from) {
      if (this.props.from) {
        this.setState({ errorFrom: false });
      }
    }
    if (prevProps.to !== this.props.to) {
      if (this.props.to) {
        this.setState({ errorTo: false });
      }
    }
  }

  // ==== поменять отправку и прибытие местами ==== //
  changeButton = () => {
    const from = this.props.from;
    const to = this.props.to;
    this.props.changeInputFrom(to);
    this.props.changeInputTo(from);
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
    const { from, to, date, amount } = this.props;
    // this.props.getError("");

    // ==== проверка на не пустой инпут ==== //
    if (!this.props.from) {
      this.setState({ errorFrom: true });
      return;
    }
    if (!this.props.to) {
      this.setState({ errorTo: true });
      return;
    }
    // ==== запускаем лоадинг, очищаем ошибки и данные предыдущего запроса ==== //
    this.props.getError("");
    this.props.fetchTripsSuccess({});
    this.props.startLoader();

    //  ==== переход на страницу поездок ==== //
    const fromId = this.getId(from, "from");
    const toId = this.getId(to, "to");
    if (fromId && toId) {
      this.props.history.push(
        `/trips?from=${fromId}&to=${toId}&date=${format(
          new Date(date),
          "yyyy-MM-dd"
        )}&passengers=${amount}`
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
      <div className={`${styles.searchForm}`}>
        <form onSubmit={this.handleSubmit} className={`${styles.form} `}>
          <div className={styles.inputBox}>
            <AutocompleteComp id="from" error={this.state.errorFrom} />
          </div>
          <Arrow className={styles.arrow} onClick={this.changeButton} />
          <div className={styles.inputBox}>
            <AutocompleteComp id="to" error={this.state.errorTo} />
          </div>
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

          <Button
            className={styles.searchBtn}
            type="submit"
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </form>
      </div>
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
  // fetchTripsStart: (trips) => dispatch(fetchTripsStart(trips)),
  startLoader: () => dispatch(startLoader()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
