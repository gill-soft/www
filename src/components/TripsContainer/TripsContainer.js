import React, { Component } from "react";
import { connect } from "react-redux";
import TripBox from "./TripBox";
import FilterButtons from "./FilterButtons";
import styles from "./TripsContainer.module.css";
import { getLocality } from "../../services/getInfo";
import { getTripsInfo } from "../../redux/trips/tripsActions";

class TripsContainer extends Component {
  state = {
    bySort: "up",
  };

  componentDidUpdate(prevProps, prevState) {
    const { trips, getTripsInfo } = this.props;

    if (prevProps.trips !== trips) {
      if (Object.keys(trips).length > 0) {
        getTripsInfo(Object.values(trips.segments).sort((a, b) => {
          const A = a.price.amount;
          const B = b.price.amount;
          return  A - B;
        }));
      } else {
        getTripsInfo([]);
      }
    }
  }

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

  render() {
    const { error, isLoading, tripsInfo, stops, trips } = this.props;
    console.log(this.props.location);

    return (
      <>
        {error && <p>{error}</p>}
        {isLoading && <div>Loading...</div>}
        {tripsInfo.length > 0 && Object.keys(trips).length > 0 && (
          <div className={styles.container}>
            <h3 className={styles.title}>
              Расписание автобусов{' '}
              {getLocality(
                stops,
                trips.tripContainers[0].request.localityPairs[0][0]
              )} -{" "}
              {getLocality(stops, trips.tripContainers[0].request.localityPairs[0][1])}
              {/* на{" "}
            {getDate()} */}
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
  // from: state.searchForm.from,
  // to: state.searchForm.to,
  // date: state.searchForm.date,
  stops: state.searchForm.stops,
  tripsInfo: state.trips.tripsInfo,
});

const mapDispatchToProps = (dispatch) => ({
  getTripsInfo: (trips) => dispatch(getTripsInfo(trips)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripsContainer);
