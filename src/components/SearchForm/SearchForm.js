import React, { Component } from "react";
import { connect } from "react-redux";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-GB";
import ua from "date-fns/locale/uk";
import pl from "date-fns/locale/pl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { searchTrips, getInitialization } from "../../services/api";
import { fetchStops } from "../../redux/searchForm/searchFormOperation";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import Autocomplite from "./Autocomplite";

class SearchForm extends Component {
  state = {
    inputDate: new Date(),
    trips: [],
  };

  //  ==== получаем все остановки через redux ==== //
  componentDidMount() {
    this.props.fetchStops();
  }

  // ==== поменять отправку и прибытие местами ==== //
  changeButton = () => {
    const from = this.props.from;
    const to = this.props.to;
    this.props.changeInputFrom(to);
    this.props.changeInputTo(from);
  };
  dateLocale = () => {
    const { lang } = this.props;
    if (lang === "EN") return en;
    if (lang === "RU") return ru;
    if (lang === "UA") return ua;
    if (lang === "PL") return pl;
  };
  // ==========================================
  // ========== поиск маршрутов ==============
  // handleClickSearch = (e) => {
  //   this.searchTrips(e);
  // };

  searchTrips = (e) => {
    e.preventDefault();
    const requestData = {
      idFrom: this.getId(this.props.from.trim()),
      idWhereTo: this.getId(this.props.to.trim()),
      date: format(Date.now(this.state.inputDate), "yyyy-MM-dd"),
    };

    const time = Date.now();
    getInitialization(requestData)
      .then(({ data }) => this.searchRouts(data.searchId, time))
      .catch((err) => console.log(err));
  };

  searchRouts = (id, time) => {
    console.log("startFechRouts");
    let deltaTime = Date.now() - time;

    if (deltaTime <= 3000) {
      setTimeout(() => {
        searchTrips(id).then(({ data }) => {
          data.searchId
            ? this.searchRouts(data.searchId, time)
            : this.setState((prev) => ({ trips: [...prev.trips, data] }));
        });
      }, 300);
    } else if (deltaTime > 3000 && deltaTime < 30000) {
      console.log("object");
      setTimeout(() => {
        searchTrips(id).then(({ data }) => {
          data.searchId
            ? this.searchRouts(data.searchId, time)
            : this.setState((prev) => ({ trips: [...prev.trips, data] }));
        });
      }, 2000);
    } else {
      return console.log("нет поездок");
    }
  };

  getId = (val) => {
    const { lang, stops } = this.props;
    const [result] = stops.filter((item) =>
      item.type === "LOCALITY"
        ? (item.name[`${lang}`] || item.name["EN"]).toLowerCase() ===
          val.toLowerCase().trim()
        : null
    );
    return result.id;
  };

  // ========== конец поиск маршрутов ==============
  render() {
    const { inputDate } = this.state;
    return (
      <>
        <form onSubmit={this.searchTrips} className='form'>
          <Autocomplite id="from" />
          <button type="button" className="change" onClick={this.changeButton}>
            &hArr;
          </button>
          <Autocomplite id="to" />

            <DatePicker
              className="testDP"
              dateFormat="dd MMMM yyyy"
              selected={inputDate}
              minDate={new Date()}
              locale={this.dateLocale()}
              onChange={(date) => this.setState({ inputDate: date })}
            />
          <button type="submit">search</button>
        </form>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.language,
  stops: state.searchForm.stops,
  from: state.searchForm.from,
  to: state.searchForm.to,
});
const mapDispatchToProps = (dispatch) => ({
  fetchStops: () => dispatch(fetchStops()),
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
