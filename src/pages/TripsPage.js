import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import styles from "./TripsPage.module.css";
import { getInitialization } from "../services/api";
import { getScroll } from "../services/getScroll";
import { getError, startLoader } from "../redux/global/globalActions";
import { searchRouts } from "../redux/trips/tripsOperations";
import { inputValueFrom, inputValueTo } from "../redux/searchForm/searchFormAction";
import SearchForm from "../components/SearchForm/SearchForm";
import DateCarousel from "../components/TripsContainer/DateCarousel";
import NoTrips from "../components/TripsContainer/NoTrips";
import SearchFormBaner from "../components/SearchFormBaner/SearchFormBaner";
import { newUrl } from "../services/getUrl";
import Trips from "../components/TripsContainer/Trips";

const windowWidth = window.innerWidth;

class TripsPage extends Component {
  state = {
    scroll: false,
  };
  componentDidMount() {
    const { startLoader, location, setFrom, setTo, match, lang } = this.props;
    const parsed = queryString.parse(location.search);
    startLoader();
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
    const { time, location, lang, history, match } = this.props;
    const parsed = queryString.parse(location.search);
    // ==== если меняеться время или строка запроса  ====//
    if (prevProps.time !== time || prevProps.location.pathname !== location.pathname) {
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
    const { error, history, trips } = this.props;
    return (
      <>
        {error && <Redirect to="/error" />}
        {windowWidth >= 768 && (
          <SearchFormBaner history={history} scroll={this.state.scroll} />
        )}
        <div className="bgnd">
          <div className="container">
            <div className={styles.formBox}>
              <SearchForm history={history} scroll={this.state.scroll} />
            </div>
            {trips ? (
              <Trips />
            ) : (
              <>
                <NoTrips />
                <DateCarousel />
              </>
            )}
          </div>
          {/* <pre>{JSON.stringify(this.props.trips, null, 4)}</pre> */}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.global.error,
  lang: state.language,
  time: state.searchForm.time,
  from: state.searchForm.from,
  to: state.searchForm.to,
  trips: state.trips.trips,
});

const mapDispatchToProps = (dispatch) => ({
  getError: (error) => dispatch(getError(error)),
  startLoader: () => dispatch(startLoader()),
  setFrom: (value) => dispatch(inputValueFrom(value)),
  setTo: (value) => dispatch(inputValueTo(value)),
  searchRouts: (id, time, requestData) => dispatch(searchRouts(id, time, requestData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);
