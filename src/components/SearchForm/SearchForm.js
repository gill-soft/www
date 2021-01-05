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
import { searchTrips, getInitialization } from "../../services/api";
import { fetchStops } from "../../redux/searchForm/searchFormOperation";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import { fetchTripsSuccess, fetchTripsError } from "../../redux/trips/tripsActions";
import Autocomplite from "./Autocomplite";

class SearchForm extends Component {
  state = {
    inputDate: new Date(),
    errorFrom: false,
    errorTo: false,
  };

  //  ==== получаем все остановки через redux ==== //
  componentDidMount() {
    this.props.fetchStops();
  }

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
  // ==========================================
  // ========== поиск маршрутов ==============

  searchTrips = (e) => {
    e.preventDefault();
    // ==== проверка на не пустой инпут ==== //
    if (!this.props.from) {
      this.setState({ errorFrom: true });
      return;
    }
    if (!this.props.to) {
      this.setState({ errorTo: true });
      return;
    }
    // ==== преобразование данных для завпроса ====
    const requestData = {
      idFrom: this.getId(this.props.from.trim()),
      idWhereTo: this.getId(this.props.to.trim()),
      date: format(Date.now(this.state.inputDate), "yyyy-MM-dd"),
    };

    const time = Date.now();
    // console.log(requestData)
    if (requestData.idFrom && requestData.idWhereTo && requestData.date) {
      getInitialization(requestData)
        .then(({ data }) => this.searchRouts(data.searchId, time))
        .catch((err) => this.props.fetchTripsError(err));
    }
  };

  // ==== цикл поиска результатов поездки ==== //
  searchRouts = (id, time) => {
    let deltaTime = Date.now() - time;

    if (deltaTime <= 100) {
      searchTrips(id)
        .then(({ data }) => {
          data.searchId
            ? this.searchRouts(data.searchId, time)
            : this.props.fetchTripsSuccess(data);
        })
        .catch((err) => this.props.fetchTripsError(err));
    } else if (deltaTime <= 3000) {
      setTimeout(() => {
        searchTrips(id)
          .then(({ data }) => {
            data.searchId
              ? this.searchRouts(data.searchId, time)
              : this.props.fetchTripsSuccess(data);
          })
          .catch((err) => this.props.fetchTripsError(err));
      }, 300);
    } else if (deltaTime > 3000 && deltaTime < 30000) {
      console.log("object");
      setTimeout(() => {
        searchTrips(id)
          .then(({ data }) => {
            data.searchId
              ? this.searchRouts(data.searchId, time)
              : this.props.fetchTripsSuccess(data);
          })
          .catch((err) => this.props.fetchTripsError(err));
      }, 2000);
    } else {
      return this.props.fetchTripsError("нет поездок");
    }
  };

  //  ==== получение id города из названия === //
  getId = (val) => {
    const { lang, stops } = this.props;
    const [result] = stops.filter((item) =>
      item.type === "LOCALITY"
        ? (item.name[`${lang}`] || item.name["EN"]).toLowerCase() ===
          val.toLowerCase().trim()
        : null
    );
    if (result) {
      return result.id;
    } else {
       this.props.fetchTripsError("уточните параметры поиска"); return
    }
  };
  // ========== конец поиск маршрутов ==============

  render() {
    const { inputDate } = this.state;
    return (
      <>
        <form onSubmit={this.searchTrips} className="form">
          <Autocomplite id="from" error={this.state.errorFrom} />
          <button type="button" className="change" onClick={this.changeButton}>
            &hArr;
          </button>
          <Autocomplite id="to" error={this.state.errorTo} />

          <DatePicker
            className="testDP"
            dateFormat="dd MMMM yyyy"
            selected={inputDate}
            minDate={new Date()}
            locale={this.dateLocale()}
            onChange={(date) => this.setState({ inputDate: date })}
          />
          <Button className="search" type="submit" variant="contained" color="primary">
            Search
          </Button>
        </form>
        <pre>{JSON.stringify(this.props.trips, null, 2)}</pre>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.language,
  stops: state.searchForm.stops,
  from: state.searchForm.from,
  to: state.searchForm.to,
  trips: state.trips.trips,
});
const mapDispatchToProps = (dispatch) => ({
  fetchStops: () => dispatch(fetchStops()),
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  fetchTripsError: (err) => dispatch(fetchTripsError(err)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
