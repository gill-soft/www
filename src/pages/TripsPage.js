import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import { IntlProvider, FormattedMessage } from "react-intl";
import styles from "./TripsPage.module.css";
import { messages } from "../intl/TripsPageMessanges";
import { getLocality } from "../services/getInfo";
import { getInitialization } from "../services/api";
import { getScroll } from "../services/getScroll";
import {
  fetchTripsSuccess,
  setDoubleTrips,
  setIsTrips,
  setSingleTrips,
} from "../redux/trips/tripsActions";
import { getError, startLoader } from "../redux/global/globalActions";
import { searchRouts } from "../redux/trips/tripsOperations";
import { inputValueFrom, inputValueTo } from "../redux/searchForm/searchFormAction";
import SearchForm from "../components/SearchForm/SearchForm";
import Scelet from "../components/TripsContainer/Skelet";
import DateCarousel from "../components/TripsContainer/DateCarousel";
import NoTrips from "../components/TripsContainer/NoTrips";
import DoubleTrips from "../components/TripsContainer/DoubleTrips";
import SingleTrips from "../components/TripsContainer/SingleTrips";
import SortTripsSingle from "../components/TripsContainer/SortTripsSingle";
import SortTripsSingleMob from "../components/TripsContainer/SortTripsSingleMob";
import SortTripsDouble from "../components/TripsContainer/SortTripsDouble";
import SortTripsDoubleMob from "../components/TripsContainer/SotrTripsDoubleMob";
import SearchFormBaner from "../components/SearchFormBaner/SearchFormBaner";

const windowWidth = window.innerWidth;

class TripsPage extends Component {
  state = {
    scroll: 0,
  };
  componentDidMount() {
    const { startLoader, location, setFrom, setTo, match } = this.props;
    const parsed = queryString.parse(location.search);
    startLoader();
    setSingleTrips([]);
    setDoubleTrips([]);
    setFrom({ text: match.params.from, value: parsed.from });
    setTo({ text: match.params.to, value: parsed.to });

    window.addEventListener("scroll", this.handleScroll);

    window.scrollTo({
      top: getScroll(windowWidth),
      behavior: "smooth",
    });

    //  ====  начинаем поиск ==== //
    this.startSerch(Date.now(), this.getRequestData(parsed));
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.handleScroll);

  }

  componentDidUpdate(prevProps, prevState) {
    const { time, location, setIsTrips } = this.props;
    const parsed = queryString.parse(location.search);

    // ==== если меняеться время или строка запроса  ====//
    if (prevProps.time !== time || prevProps.location.key !== location.key) {
      setIsTrips(true);

      //  ====  начинаем поиск ==== //
      this.startSerch(Date.now(), this.getRequestData(parsed));
    }
  }

  //  ==== инициализация поиска ==== //
  startSerch = (time, requestData) => {
    const { lang, getError, searchRouts } = this.props;
    getInitialization(requestData, lang)
      .then(({ data }) => searchRouts(data.searchId, time, requestData))
      .catch((err) => getError(err.message));
  };

  handleScroll = () => {
    this.setState({ scroll: window.scrollY });
  };

  // ==== формируем обьект для запроса ==== //
  getRequestData = (parsed) => {
    return {
      idFrom: parsed.from,
      idWhereTo: parsed.to,
      date: parsed.date,
    };
  };

  render() {
    const {
      error,
      isLoading,
      singleTrips,
      doubleTrips,
      isTrips,
      history,
      stops,
      lang,
      location,
      sortTypeDouble,
      sortTypeSingle,
      trips,
    } = this.props;
    const parsed = queryString.parse(location.search);
    const locale = lang === "UA" ? "UK" : lang;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        {error && <Redirect to="/error" />}
        {windowWidth >= 768 && (
          <SearchFormBaner history={history} scroll={this.state.scroll} />
        )}

        <div className="bgnd">
          <div className="container">
            <div className={styles.formBox}>
              {this.state.scroll < 350 && <SearchForm history={history} />}
            </div>
            {isTrips && !sortTypeDouble && !sortTypeSingle ? (
              <div className={styles.tripsBox}>
                <h2 className={styles.title}>
                  <FormattedMessage id="title" />
                  <br /> {getLocality(parsed.from, stops, lang)} -{" "}
                  {getLocality(parsed.to, stops, lang)}
                </h2>
                <DateCarousel parsed={parsed} history={history} />
                {isLoading && <Scelet />}
                {singleTrips.length > 0 && (
                  <>
                    {windowWidth >= 768 ? <SortTripsSingle /> : <SortTripsSingleMob />}
                    {singleTrips.map((el, idx) => (
                      <SingleTrips key={idx} tripKey={el.id} location={location} />
                    ))}
                  </>
                )}
                {doubleTrips.length > 0 && (
                  <>
                    <h3 className={styles.titleDouble}>Рейси з пересадкою</h3>
                    {windowWidth >= 768 ? <SortTripsDouble /> : <SortTripsDoubleMob />}
                    {doubleTrips.map((el, idx) => (
                      <DoubleTrips key={idx} tripKeys={el.segments} location={location} />
                    ))}
                  </>
                )}
              </div>
            ) : (
              <>
                <NoTrips />
                <DateCarousel parsed={parsed} history={history} />
              </>
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
  lang: state.language,
  time: state.searchForm.time,
  from: state.searchForm.from.text,
  to: state.searchForm.to.text,
  singleTrips: state.trips.singleTrips,
  doubleTrips: state.trips.doubleTrips,
  isTrips: state.trips.isTrips,
  sertTypeSingle: state.trips.sortTypeSingle,
  sertTypeDouble: state.trips.sortTypeDouble,
  trips: state.trips.trips,
});

const mapDispatchToProps = (dispatch) => ({
  getError: (error) => dispatch(getError(error)),
  startLoader: () => dispatch(startLoader()),
  setFrom: (value) => dispatch(inputValueFrom(value)),
  setTo: (value) => dispatch(inputValueTo(value)),
  setSingleTrips: (arr) => dispatch(setSingleTrips(arr)),
  setDoubleTrips: (arr) => dispatch(setDoubleTrips(arr)),
  setIsTrips: (bool) => dispatch(setIsTrips(bool)),
  searchRouts: (id, time, requestData) => dispatch(searchRouts(id, time, requestData)),
  fetchTripsSuccess: (obj) => dispatch(fetchTripsSuccess(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);
