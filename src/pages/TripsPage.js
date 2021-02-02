import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "../components/TripsContainer/TripsContainer.module.css";
import {
  fetchTripsError,
  fetchTripsStart,
  fetchTripsSuccess,
  getTripsInfo,
} from "../redux/trips/tripsActions";
import TripBox from "../components/TripsContainer/TripBox";
import FilterButtons from "../components/TripsContainer/FilterButtons";
import SearchForm from "../components/SearchForm/SearchForm";
import queryString from "query-string";
import { getInitialization, searchTrips } from "../services/api";
import { getLocality } from "../services/getInfo";

class TripsPage extends Component {
  state = {
    bySort: "up",
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
      // ==== формируем обьект для запроса ====
      const requestData = {
        idFrom: parsed.from,
        idWhereTo: parsed.to,
        date: parsed.date,
      };
      const time = Date.now();
      this.startSerch(time, requestData);
    }
    // ==== сортируем по цене ==== //
    if (prevProps.trips !== trips) {
      if (Object.keys(trips).length > 0) {
        const arr = [];
        for (let [key, values] of Object.entries(trips.segments)) {
          arr.push({ [key]: values });
        }
        arr.sort(
          (a, b) =>
            a[`${Object.keys(a)}`].price.amount - b[`${Object.keys(b)}`].price.amount
        );
        getTripsInfo(arr);
      }
    }
  }

  //  ==== инициализация поиска ==== //
  startSerch = (time, requestData) => {
    getInitialization(requestData, this.props.lang)
      .then(({ data }) => this.searchRouts(data.searchId, time, requestData))
      .catch(({ err }) => this.props.fetchTripsError(err))
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
        .catch(({ err }) => this.props.fetchTripsError(err))
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
          .catch(({ err }) => this.props.fetchTripsError(err))
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
          .catch(({ err }) => this.props.fetchTripsError(err))
          .finally(this.props.fetchTripsStart());
      }, 2000);
    } else {
      return this.props.fetchTripsError("нет поездок");
    }
  };

  sortTimeInWay = () => {
    const { bySort } = this.state;
    if (bySort === "up") this.setState({ bySort: "down" });
    if (bySort === "down") this.setState({ bySort: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`].timeInWay.split(":");
      const time_partsB = b[`${Object.keys(b)}`].timeInWay.split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];

      return bySort === "up" ? A - B : B - A;
    });
  };
  sortDepartureTime = () => {
    const { bySort } = this.state;
    if (bySort === "up") this.setState({ bySort: "down" });
    if (bySort === "down") this.setState({ bySort: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`].departureDate.split(" ")[1].split(":");
      const time_partsB = b[`${Object.keys(b)}`].departureDate.split(" ")[1].split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];

      return bySort === "up" ? A - B : B - A;
    });
  };
  sortArrivalTime = () => {
    const { bySort } = this.state;
    if (bySort === "up") this.setState({ bySort: "down" });
    if (bySort === "down") this.setState({ bySort: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`].arrivalDate.split(" ")[1].split(":");
      const time_partsB = b[`${Object.keys(b)}`].arrivalDate.split(" ")[1].split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];

      return bySort === "up" ? A - B : B - A;
    });
  };

  sortPrice = () => {
    const { bySort } = this.state;
    if (bySort === "up") this.setState({ bySort: "down" });
    if (bySort === "down") this.setState({ bySort: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const A = a[`${Object.keys(a)}`].price.amount;
      const B = b[`${Object.keys(b)}`].price.amount;
      return bySort === "up" ? A - B : B - A;
    });
  };

  render() {
    const { error, isLoading, tripsInfo, trips, history, stops, lang } = this.props;
    const parsed = queryString.parse(this.props.location.search);

    return (
      <>
        <SearchForm history={history} />
        {isLoading && <div>Loading...</div>}
        {error && <p>{error}</p>}
        {Object.keys(trips).length > 0 && (
          <div className={styles.container}>
            <h3 className={styles.title}>
              Расписание автобусов {getLocality(parsed.from, stops, lang)} -
              {getLocality(parsed.to, stops, lang)}
            </h3>
            <FilterButtons
              sortTimeInWay={this.sortTimeInWay}
              sortDepartureTime={this.sortDepartureTime}
              sortArrivalTime={this.sortArrivalTime}
              sortPrice={this.sortPrice}
            />

            {tripsInfo.map((el, idx) => (
              <TripBox
                key={idx}
                trip={el[`${Object.keys(el)}`]}
                tripKey={Object.keys(el)}
                from={getLocality(parsed.from, stops, lang)}
                to={getLocality(parsed.to, stops, lang)}
              />
            ))}
            <pre>{JSON.stringify(trips, null, 4)}</pre>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  isLoading: state.trips.isLoading,
  error: state.trips.error,
  stops: state.searchForm.stops,
  lang: state.language,
  tripsInfo: state.trips.tripsInfo,
});

const mapDispatchToProps = (dispatch) => ({
  getTripsInfo: (trips) => dispatch(getTripsInfo(trips)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  fetchTripsError: (err) => dispatch(fetchTripsError(err)),
  fetchTripsStart: (trips) => dispatch(fetchTripsStart(trips)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);
