import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./TripsPage.module.css";
import { fetchTripsSuccess, getTripsInfo } from "../redux/trips/tripsActions";
import TripBox from "../components/TripsContainer/TripBox";
import SearchForm from "../components/SearchForm/SearchForm";
import queryString from "query-string";
import { getInitialization, searchTrips } from "../services/api";
import {
  getLocality,
  getTodayDate,
  getTomorrow,
  getYesterday,
} from "../services/getInfo";
import { stopLoader, getError, startLoader } from "../redux/global/globalActions";
import { format } from "date-fns";
import Loader from "../components/Loader/Loader";

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
    const { trips, getTripsInfo } = this.props;
    const parsed = queryString.parse(this.props.location.search);

    // ==== если меняеться строка запроса или язык пользователя  ====//
    if (
      prevProps.location.search !== this.props.location.search ||
      prevProps.lang !== this.props.lang
    ) {
      this.setState({ value: "price" });
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

  sortTimeInWay = () => {
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`].timeInWay.split(":");
      const time_partsB = b[`${Object.keys(b)}`].timeInWay.split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];
      return A - B;
    });
  };
  sortTime = (key) => {
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`][`${key}`].split(" ")[1].split(":");
      const time_partsB = b[`${Object.keys(b)}`][`${key}`].split(" ")[1].split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];
      return A - B;
    });
  };
  sortPrice = () => {
    this.props.tripsInfo.sort((a, b) => {
      const A = a[`${Object.keys(a)}`].price.amount;
      const B = b[`${Object.keys(b)}`].price.amount;
      return A - B;
    });
  };
  handleSort = ({ target }) => {
    this.setState({ value: target.value });
    if (target.value === "departure") this.sortTime("departureDate");
    if (target.value === "arrival") this.sortTime("arrivalDate");
    if (target.value === "timeInWay") this.sortTimeInWay();
    if (target.value === "price") this.sortPrice();
  };

  changeDate = ({ target }) => {
    const parsed = queryString.parse(this.props.location.search);
    const nextDay = format(
      new Date(new Date(parsed.date).getTime() + 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    );
    const prevDay = format(
      new Date(new Date(parsed.date).getTime() - 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    );
    const newDay = target.name === "prev" ? prevDay : nextDay;
    this.props.history.push(
      `/trips?from=${parsed.from}&to=${parsed.to}&date=${newDay}&passengers=1`
    );
  };

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
    return (
      <div className={styles.bgnd}>
        <div className={styles.container}>
          <div className={styles.formBox}>
            <SearchForm history={history} />
          </div>
          {isLoading && <Loader />}
          {error && <p>{error}</p>}
          {Object.keys(trips).length > 0 && (
            <div className={styles.tripsBox}>
              <h3 className={styles.title}>
                Расписание автобусов {getLocality(parsed.from, stops, lang)} -{" "}
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
              <div className={styles.selectBox}>
                <label>
                  Cортировать по:{" "}
                  <select
                    className={styles.select}
                    name="sort"
                    value={this.state.value}
                    onChange={this.handleSort}
                  >
                    <option className={styles.option} value="price">
                      цене
                    </option>
                    <option className={styles.option} value="departure">
                      времени отправки
                    </option>
                    <option className={styles.option} value="arrival">
                      времени прибытия
                    </option>
                    <option className={styles.option} value="timeInWay">
                      времени в пути
                    </option>
                  </select>
                </label>
              </div>

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
});

const mapDispatchToProps = (dispatch) => ({
  getTripsInfo: (trips) => dispatch(getTripsInfo(trips)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  startLoader: () => dispatch(startLoader()),
  stopLoader: () => dispatch(stopLoader()),
  getError: (error) => dispatch(getError(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);
