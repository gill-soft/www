import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import { IntlProvider, FormattedMessage } from "react-intl";
import styles from "./TripsPage.module.css";
import { messages } from "../intl/TripsPageMessanges";
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
import SortTripsSingle from "../components/TripsContainer/SortTripsSingle";
import SortTripsSingleMob from "../components/TripsContainer/SortTripsSingleMob";
import SortTripsDouble from "../components/TripsContainer/SortTripsDouble";
import SortTripsDoubleMob from "../components/TripsContainer/SotrTripsDoubleMob";
import SearchFormBaner from "../components/SearchFormBaner/SearchFormBaner";
import { newUrl } from "../services/getUrl";

const windowWidth = window.innerWidth;

class TripsPage extends Component {
  state = {
    scroll: false,
  };
  componentDidMount() {
    const { startLoader, location, setFrom, setTo, match, lang } = this.props;
    const parsed = queryString.parse(location.search);
    startLoader();
    setSingleTrips([]);
    setDoubleTrips([]);
    setFrom({ text: match.params.from, value: parsed.from, lang: lang });
    setTo({ text: match.params.to, value: parsed.to, lang: lang });

    window.addEventListener("scroll", this.handleScroll);

    window.scrollTo({
      top: getScroll(windowWidth),
      behavior: "smooth",
    });

    //  ====  начинаем поиск ==== //
    this.startSerch(Date.now(), this.getRequestData(parsed));
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    const { time, location, setIsTrips, lang, history, match } = this.props;
    const parsed = queryString.parse(location.search);
    // ==== если меняеться время или строка запроса  ====//
    if (prevProps.time !== time || prevProps.location.pathname !== location.pathname) {
      setIsTrips(true);
      //  ====  начинаем поиск ==== //
      this.startSerch(Date.now(), this.getRequestData(parsed));
    }

    // ==== смена url при изменении языка ==== //
    if (prevProps.lang !== lang) {
      newUrl(match.params, lang, parsed.from, parsed.to).then((data) => {
        history.replace(`${data}${location.search}`);
      });
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
    if (window.scrollY >= 450 && this.state.scroll) return;
    if (window.scrollY < 450 && !this.state.scroll) return;
    if (window.scrollY >= 450) this.setState({ scroll: true });
    if (window.scrollY < 450) this.setState({ scroll: false });
  };

  // ==== формируем обьект для запроса ==== //
  getRequestData = (parsed) => {
    return {
      idFrom: parsed.from,
      idTo: parsed.to,
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
      match,
      lang,
      location,
      trips,
    } = this.props;
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
              <SearchForm history={history} scroll={this.state.scroll} />
            </div>
            {isTrips ? (
              <div className={styles.tripsBox}>
                <h2 className={styles.title}>
                  <FormattedMessage id="title" />
                  <br /> {match.params.from} - {match.params.to}
                </h2>
                <DateCarousel />
                {isLoading && <Scelet />}
                {singleTrips.length > 0 && (
                  <>
                    {windowWidth >= 768 ? <SortTripsSingle /> : <SortTripsSingleMob />}
                    {singleTrips.map((el, idx) => (
                      <DoubleTrips key={idx} tripKeys={el.id} location={location} />
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
                <DateCarousel />
              </>
            )}
          </div>
          {/* <pre>{JSON.stringify(trips, null, 4)}</pre> */}
        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.global.isLoading,
  error: state.global.error,
  lang: state.language,
  time: state.searchForm.time,
  from: state.searchForm.from,
  to: state.searchForm.to,
  singleTrips: state.trips.singleTrips,
  doubleTrips: state.trips.doubleTrips,
  isTrips: state.trips.isTrips,
  sortTypeSingle: state.trips.sortTypeSingle,
  sortTypeDouble: state.trips.sortTypeDouble,
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
