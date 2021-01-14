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
import {
  inputValueFrom,
  inputValueTo,
  inputValueDate,
} from "../../redux/searchForm/searchFormAction";
import {
  fetchTripsSuccess,
  fetchTripsError,
  fetchTripsStart,
} from "../../redux/trips/tripsActions";
import styles from "./SearchForm.module.css";
import Autocomplite from "./Autocomplite";
import { ReactComponent as Arrow } from "../../images/sync_alt-white-36dp.svg";

class SearchForm extends Component {
  state = {
    // inputDate: new Date(),
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
    const {from, to, date} = this.props
    this.props.fetchTripsError("");

    // ==== проверка на не пустой инпут ==== //
    if (!this.props.from) {
      this.setState({ errorFrom: true });
      return;
    }
    if (!this.props.to) {
      this.setState({ errorTo: true });
      return;
    }
    // ==== запускаем лоадинг и очищаем ошибки ==== //
    this.props.fetchTripsError("");
    this.props.fetchTripsStart();
    this.props.fetchTripsSuccess({})
    // ==== преобразование данных для запроса ====
    const requestData = {
      idFrom: this.getId(from.trim()),
      idWhereTo: this.getId(to.trim()),
      date: format(new Date(date), "yyyy-MM-dd"),
    };
    //  ==== при успешном преобразовании введеных данных в id-городов начинаем поиск ==== //
    if (requestData.idFrom && requestData.idWhereTo && requestData.date) {
      const time = Date.now();
      this.startSerch(time, requestData);
    }
  };
  //  ==== инициализация поиска ==== //
  startSerch = (time, requestData) => {
    getInitialization(requestData)
      .then(({ data }) => this.searchRouts(data.searchId, time, requestData))
      .catch(({err}) => this.props.fetchTripsError(err))
      .finally(this.props.fetchTripsStart());
  };

  // ==== цикл поиска результатов поездки ==== //
  searchRouts = (id, time, requestData) => {
    let deltaTime = Date.now() - time;
    if (deltaTime <= 100) {
      searchTrips(id)
        .then(({ data }) => {
          if (data.searchId) {
            this.searchRouts(data.searchId, time, requestData);
          } else {
            if (data.segments) {
              this.props.fetchTripsSuccess(data);
            } else {
              this.startSerch(time, requestData);
            }
          }
        })
        .catch(({err}) => this.props.fetchTripsError(err))
        .finally(this.props.fetchTripsStart());
    } else if (deltaTime <= 3000) {
      setTimeout(() => {
        searchTrips(id)
          .then(({ data }) => {
            if (data.searchId) {
              this.searchRouts(data.searchId, time, requestData);
            } else {
              if (data.segments) {
                this.props.fetchTripsSuccess(data);
              } else {
                this.startSerch(time, requestData);
              }
            }
          })
          .catch(({err}) => this.props.fetchTripsError(err))
          .finally(this.props.fetchTripsStart());
      }, 300);
    } else if (deltaTime > 3000 && deltaTime < 5000) {
      setTimeout(() => {
        searchTrips(id)
          .then(({ data }) => {
            if (data.searchId) {
              this.searchRouts(data.searchId, time, requestData);
            } else {
              if (data.segments) {
                this.props.fetchTripsSuccess(data);
              } else {
                this.startSerch(time, requestData);
              }
            }
          })
          .catch(({err}) => this.props.fetchTripsError(err))
          .finally(this.props.fetchTripsStart());
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
      this.props.fetchTripsError("уточните параметры поиска");
      return;
    }
  };
  // ========== конец поиск маршрутов ==============

  render() {
    const { date, changeInputDate} = this.props;
    return (
      <div className={`${styles.searchForm} `}>
        <form onSubmit={this.searchTrips} className={`${styles.form} `}>
          <Autocomplite id="from" error={this.state.errorFrom} />
          {/* <button type="button" className="change" onClick={this.changeButton}> */}
          <Arrow onClick={this.changeButton} />
          <Autocomplite id="to" error={this.state.errorTo} />
          <DatePicker
            className={styles.datePicker}
            dateFormat="dd MMMM yyyy"
            selected={date}
            minDate={new Date()}
            locale={this.dateLocale()}
            onChange={(date) => changeInputDate( date)}
          />

          <Button
            className={styles.searchBtn}
            type="submit"
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </form>
        {/* <pre>{JSON.stringify(this.props.trips, null, 2)}</pre> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.language,
  stops: state.searchForm.stops,
  from: state.searchForm.from,
  to: state.searchForm.to,
  date: state.searchForm.date,
  trips: state.trips.trips,
});
const mapDispatchToProps = (dispatch) => ({
  fetchStops: () => dispatch(fetchStops()),
  changeInputFrom: (value) => dispatch(inputValueFrom(value)),
  changeInputTo: (value) => dispatch(inputValueTo(value)),
  changeInputDate: (date) => dispatch(inputValueDate(date)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  fetchTripsError: (err) => dispatch(fetchTripsError(err)),
  fetchTripsStart: (trips) => dispatch(fetchTripsStart(trips)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
