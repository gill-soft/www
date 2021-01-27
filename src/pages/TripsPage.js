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
// import { fetchAmountPassanger } from "../redux/order/orderActions";

class TripsPage extends Component {
  state = {
    bySort: "up",
  };

  componentDidMount() {
    console.log("object")
    const parsed = queryString.parse(this.props.location.search);

    // ==== преобразование данных для запроса ====
    const requestData = {
      idFrom: this.getId(parsed.from.trim()),
      idWhereTo: this.getId(parsed.to.trim()),
      date: parsed.date,
    };
    //  ==== при успешном преобразовании введеных данных в id-городов начинаем поиск ==== //
    if (requestData.idFrom && requestData.idWhereTo && requestData.date) {
      const time = Date.now();
      this.startSerch(time, requestData);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { trips, getTripsInfo } = this.props;
    const parsed = queryString.parse(this.props.location.search);

    if (prevProps.location.search !== this.props.location.search) {
      const requestData = {
        idFrom: this.getId(parsed.from.trim()),
        idWhereTo: this.getId(parsed.to.trim()),
        date: parsed.date,
      };
      if (requestData.idFrom && requestData.idWhereTo && requestData.date) {
        const time = Date.now();
        this.startSerch(time, requestData);
      }
    }

    if (prevProps.trips !== trips) {
      if (Object.keys(trips).length > 0) {
        getTripsInfo(
          Object.values(trips.segments).sort((a, b) => {
            const A = a.price.amount;
            const B = b.price.amount;
            return A - B;
          })
        );
      } else {
        getTripsInfo([]);
      }
    }
  }

  //  ==== инициализация поиска ==== //
  startSerch = (time, requestData) => {
    getInitialization(requestData)
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

  sortTimeInWay = () => {
    const { bySort } = this.state;
    if (bySort === "up") this.setState({ bySort: "down" });
    if (bySort === "down") this.setState({ bySort: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a.timeInWay.split(":");
      const time_partsB = b.timeInWay.split(":");
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
      const time_partsA = a.departureDate.split(" ")[1].split(":");
      const time_partsB = b.departureDate.split(" ")[1].split(":");
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
      const time_partsA = a.arrivalDate.split(" ")[1].split(":");
      const time_partsB = b.arrivalDate.split(" ")[1].split(":");
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
      const A = a.price.amount;
      const B = b.price.amount;
      return bySort === "up" ? A - B : B - A;
    });
  };

  getLocality = (key) => {
    const parsed = queryString.parse(this.props.location.search);
    return parsed[`${key}`];
  };

  render() {
    const { error, isLoading, tripsInfo, trips, history } = this.props;
    return (
      <>
        <SearchForm history={history} />
        {isLoading && <div>Loading...</div>}
        {error && <p>{error}</p>}
        {Object.keys(trips).length > 0 && (
          <div className={styles.container}>
            <h3 className={styles.title}>
              Расписание автобусов {this.getLocality("from")} - {this.getLocality("to")}
            </h3>
            <FilterButtons
              sortTimeInWay={this.sortTimeInWay}
              sortDepartureTime={this.sortDepartureTime}
              sortArrivalTime={this.sortArrivalTime}
              sortPrice={this.sortPrice}
            />

            {tripsInfo.map((el, idx) => (
              <TripBox key={idx} trip={el} />
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
  // fetchAmountPassanger: val => dispatch(fetchAmountPassanger(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);
