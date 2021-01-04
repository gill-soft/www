import React, { Component } from "react";
import { connect } from "react-redux";
import { searchTrips, getInitialization } from "../../services/api";
import { fetchStops } from "../../redux/searchForm/searchFormOperation";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import Autocomplite from "./Autocomplite";

class SearchForm extends Component {
  state = {
    inputDate: this.getCurrentDate(),
    trips: [],
  };

  //  ==== получаем все остановки через redux ==== //
  componentDidMount() {
    this.props.fetchStops();
  }

  getCurrentDate() {
    return `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
      new Date().getDate() + 2
    }`;
  }

  // ==== поменять отправку и прибытие местами ==== //
  changeButton = () => {
    const from = this.props.from;
    const to = this.props.to;
    this.props.changeInputFrom(to);
    this.props.changeInputTo(from);
  };

  // ==========================================
  // ========== поиск маршрутов ==============
  handleClickSearch = (e) => {
    this.searchTrips(e);
  };

  searchTrips = (e) => {
    e.preventDefault();
    const requestData = {
      idFrom: this.getId(this.props.from.trim()),
      idWhereTo: this.getId(this.props.to.trim()),
      date: this.state.inputDate,
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
        <form onSubmit={this.searchTrips}>
          <Autocomplite id="from" />
          <button type="button" onClick={this.changeButton}>
            &hArr;
          </button>
          <Autocomplite id="to" />

          <input
            name="inputDate"
            // value={inputDate}
            type="date"
            defaultValue={inputDate}
          ></input>

          <button type="submit" onClick={this.handleClickSearch}>
            search
          </button>
        </form>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.language,
  stops: state.searchForm.stops,
  // filteredStops: state.searchForm.filteredStops,
  from: state.searchForm.from,
  to: state.searchForm.to,
  // isVisible: state.searchForm.isVisible,
});
const mapDispatchToProps = (dispatch) => ({
  fetchStops: () => dispatch(fetchStops()),
  // getFilteredStops: arr => dispatch(getFilteredStops(arr)),
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
  // getClassName: value => dispatch(getClassName(value)),
  // toggleIsVisible: () => dispatch(toggleIsVisible()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
