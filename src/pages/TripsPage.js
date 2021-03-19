import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import styles from "./TripsPage.module.css";
import { getLocality } from "../services/getInfo";
import { getInitialization, searchTrips } from "../services/api";
import {
  changeSortType,
  fetchTripsSuccess,
  getTripsInfo,
} from "../redux/trips/tripsActions";
import { stopLoader, getError, startLoader } from "../redux/global/globalActions";
import TripBox from "../components/TripsContainer/TripBox";
import SearchForm from "../components/SearchForm/SearchForm";
import SortTrips from "../components/TripsContainer/SortTrips";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/TripsPageMessanges";
import { Redirect } from "react-router-dom";
import Scelet from "../components/TripsContainer/Skelet";
import DateCarousel from "../components/TripsContainer/DateCarousel";
import NoTrips from "../components/TripsContainer/NoTrips";
import { getScroll } from "../services/getScroll";
import { inputValueFrom, inputValueTo } from "../redux/searchForm/searchFormAction";
const windowWidth = window.innerWidth;

class TripsPage extends Component {
  state = {
    isTrip: false,
  };
  componentDidMount() {
    this.props.startLoader();
    this.props.getTripsInfo([]);
    const parsed = queryString.parse(this.props.location.search);

    const {  setFrom, setTo } = this.props;
     setFrom({ text: this.props.match.params.from, value:parsed.from});
     setTo({ text: this.props.match.params.to, value:parsed.to });

    window.scrollTo({
      top: getScroll(windowWidth),
      behavior: "smooth",
    });
    
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
    const { trips, getTripsInfo, time, location, changeSortType } = this.props;
    const parsed = queryString.parse(location.search);

    // ==== если меняеться время или строка запроса  ====//
    if (prevProps.time !== time) {
      this.setState({ isTrip: false });
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
      changeSortType("price");
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
    } else if (deltaTime > 3000 && deltaTime < 10000) {
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
      this.setState({ isTrip: true });
    }
  };

  render() {
    const { error, isLoading, tripsInfo, history, stops, lang } = this.props;
    const parsed = queryString.parse(this.props.location.search);
    const locale = lang === "UA" ? "UK" : lang;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        {error && <Redirect to="/error" />}
        <div className="bgnd">
          <div className="container">
            <div className={styles.formBox}>
              <SearchForm history={history} />
            </div>
            {this.state.isTrip ? (
              <NoTrips />
            ) : (
              <div className={styles.tripsBox}>
                <h2 className={styles.title}>
                  <FormattedMessage id="title" />
                  <br /> {getLocality(parsed.from, stops, lang)} -{" "}
                  {getLocality(parsed.to, stops, lang)}
                </h2>
                <DateCarousel parsed={parsed} history={history} />
                <SortTrips />
                {isLoading && <Scelet />}
                {Object.keys(tripsInfo).length > 0 &&
                  tripsInfo.map((el, idx) => (
                    <TripBox
                      key={idx}
                      trip={el[`${Object.keys(el)}`]}
                      tripKey={Object.keys(el)}
                      from={getLocality(parsed.from, stops, lang)}
                      to={getLocality(parsed.to, stops, lang)}
                      location={this.props.location}
                    />
                  ))}
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
  sortType: state.trips.sortType,
  from: state.searchForm.from.text,
  to: state.searchForm.to.text,
});

const mapDispatchToProps = (dispatch) => ({
  getTripsInfo: (trips) => dispatch(getTripsInfo(trips)),
  fetchTripsSuccess: (trips) => dispatch(fetchTripsSuccess(trips)),
  stopLoader: () => dispatch(stopLoader()),
  getError: (error) => dispatch(getError(error)),
  changeSortType: (val) => dispatch(changeSortType(val)),
  startLoader: () => dispatch(startLoader()),
  setFrom: (value) => dispatch(inputValueFrom(value)),
  setTo: (value) => dispatch(inputValueTo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);
