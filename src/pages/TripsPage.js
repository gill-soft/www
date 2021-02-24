import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { format } from "date-fns";
import styles from "./TripsPage.module.css";
import {
  getLocality,
  getTodayDate,
  getTomorrow,
  getYesterday,
} from "../services/getInfo";
import { getInitialization, searchTrips } from "../services/api";
import Loader from "../components/Loader/Loader";
import { fetchTripsSuccess, getTripsInfo } from "../redux/trips/tripsActions";
import { stopLoader, getError, startLoader } from "../redux/global/globalActions";
import TripBox from "../components/TripsContainer/TripBox";
import SearchForm from "../components/SearchForm/SearchForm";
import SortTrips from "../components/TripsContainer/SortTrips";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/TripsPageMessanges";
import { inputValueDate, setTime } from "../redux/searchForm/searchFormAction";

class TripsPage extends Component {
  state = {
    value: "price",
  };
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    // ==== формируем обьект для запроса ====
    const requestData = {
      idFrom: parsed.from,
      idWhereTo: parsed.to,
      date: parsed.date,
    };
    //  ====  начинаем поиск ==== //
    const time = Date.now();
    this.startSerch(time, requestData);
  }

  componentDidUpdate(prevProps, prevState) {
    const { trips, getTripsInfo, time, location } = this.props;
    const parsed = queryString.parse(location.search);

    // ==== если меняеться время или строка запроса  ====//
    if (prevProps.time !== time) {
      // ==== формируем обьект для запроса ====
      const requestData = {
        idFrom: parsed.from,
        idWhereTo: parsed.to,
        date: parsed.date,
      };
      const time = Date.now();
      this.startSerch(time, requestData);
    }
    // ==== сортируем по цене и записываем в redux ==== //
    if (prevProps.trips !== trips) {
      this.setState({ value: "price" });
      if (Object.keys(trips).length > 0) {
        const arr = [];
        for (let [key, values] of Object.entries(trips.segments)) {
          arr.push({ [key]: values });
        }
        getTripsInfo(
          arr.sort(
            (a, b) =>
              a[`${Object.keys(a)}`].price.amount - b[`${Object.keys(b)}`].price.amount
          )
        );
      }
    }
  }

  //  ==== инициализация поиска ==== //
  startSerch = (time, requestData) => {
    getInitialization(requestData, this.props.lang)
      .then(({ data }) => this.searchRouts(data.searchId, time, requestData))
      .catch((err) => {
        this.props.getError(err.message);
      });
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
        .catch((err) => this.props.getError(err.message));
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
          .catch(({ err }) => this.props.getError(err));
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
          .catch(({ err }) => this.props.getError(err));
      }, 2000);
    } else {
      this.props.stopLoader();
      this.props.getError("По вашему запросу поездок нет. Попробуйте другую дату");
    }
  };

// ==== управление изменением даты на следующюю/предыдущую ==== //
  changeDate = ({ target }) => {
    const { startLoader, history, location } = this.props;
    const parsed = queryString.parse(location.search);

    startLoader();
    const newDay =
      target.name === "prev"
        ? format(
            new Date(new Date(parsed.date).getTime() - 24 * 60 * 60 * 1000),
            "yyyy-MM-dd"
          )
        : format(
            new Date(new Date(parsed.date).getTime() + 24 * 60 * 60 * 1000),
            "yyyy-MM-dd"
          );
    this.props.changeInputDate(new Date(newDay));
    this.props.setTime(new Date().getTime());
    history.push(
      `/trips?from=${parsed.from}&to=${parsed.to}&date=${newDay}&passengers=${parsed.passengers}`
    );
  };
  // ==== делаем кпопку предыдущей даты неактивной при сегодняшней дате ==== //
  getDisabled = ({ date }) => {
    const yyyy = new Date().getFullYear();
    const mm = new Date().getMonth();
    const dd = new Date().getDate();
    if (new Date(date).getTime() - 7200000 <= new Date(yyyy, mm, dd).getTime()) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { error, isLoading, tripsInfo, trips, history, stops, lang } = this.props;
    const parsed = queryString.parse(this.props.location.search);
    const locale = lang === "UA" ? "UK" : lang;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className="bgnd">
          <div className="container">
            <div className={styles.formBox}>
              <SearchForm history={history} />
            </div>
            {isLoading && <Loader />}
            {error && <p>{error}</p>}
            {Object.keys(trips).length > 0 && (
              <div className={styles.tripsBox}>
                <h3 className={styles.title}>
                  <FormattedMessage id="title" />
                  <br /> {getLocality(parsed.from, stops, lang)} -{" "}
                  {getLocality(parsed.to, stops, lang)}
                </h3>
                <div className={styles.dateBox}>
                  <button
                    className={styles.dateButton}
                    name="prev"
                    onClick={this.changeDate}
                    disabled={this.getDisabled(parsed)}
                  >
                    {getYesterday(parsed, lang)}
                  </button>
                  <p className={styles.today}>{getTodayDate(parsed, lang)}</p>
                  <button
                    className={styles.dateButton}
                    name="next"
                    onClick={this.changeDate}
                  >
                    {getTomorrow(parsed, lang)}
                  </button>
                </div>
                <SortTrips
                  onChangeValue={(val) => this.setState({ value: val })}
                  value={this.state.value}
                />
                {tripsInfo.map((el, idx) => (
                  <TripBox
                    key={idx}
                    trip={el[`${Object.keys(el)}`]}
                    tripKey={Object.keys(el)}
                    from={getLocality(parsed.from, stops, lang)}
                    to={getLocality(parsed.to, stops, lang)}
                    location={this.props.location}
                  />
                ))}
                {/* <pre>{JSON.stringify(trips, null, 4)}</pre> */}
              </div>
            )}
          </div>
        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  stops: state.global.stops,
  isLoading: state.global.isLoading,
  error: state.global.error,
  trips: state.trips.trips,
  lang: state.language,
  tripsInfo: state.trips.tripsInfo,
  time: state.searchForm.time,
});

const mapDispatchToProps = (dispatch) => ({
  getTripsInfo: (trips) => dispatch(getTripsInfo(trips)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  startLoader: () => dispatch(startLoader()),
  stopLoader: () => dispatch(stopLoader()),
  getError: (error) => dispatch(getError(error)),
  changeInputDate: (date) => dispatch(inputValueDate(date)),
  setTime: (time) => dispatch(setTime(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);
