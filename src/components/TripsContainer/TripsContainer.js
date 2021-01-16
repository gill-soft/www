// import React, { useState, useEffect } from "react";
import React, { Component } from "react";

// import { format } from "date-fns";
// import ru from "date-fns/locale/ru";
import { connect } from "react-redux";
import TripBox from "./TripBox";
import FilterButtons from "./FilterButtons";
import styles from "./TripsContainer.module.css";
import { getLocality } from "../../services/getInfo";
import { getTripsInfo } from "../../redux/trips/tripsActions";

// const TripsContainer = ({ trips, isLoading, error, stops, getTripsInfo, tripsInfo }) => {
//   // const [tripsKey, setTripsKey] = useState([]);
//   // const [tripsIn, setTripsIn] = useState([])
//   useEffect(() => {
//     if (Object.keys(trips).length > 0) {
//       // setTripsKey(Object.keys(trips.segments));
//       getTripsInfo(Object.values(trips.segments));
//     } else {
//       getTripsInfo([]);
//     }
//   }, [trips, getTripsInfo]);

//   // const getDate = () => {
//   //   // console.log(trips.tripContainers[0].request.dates[0]);
//   //   const date2 = new Date(trips.tripContainers[0].request.dates[0]);
//   //   return format(date2, "dd LLLL yyyy", { locale: ru });
//   // };

//   const hClick = () => {
//     tripsInfo.sort((a, b) => {
//       let timeA = a.timeInWay;
//       let timeB = b.timeInWay;

//       let time_partsA = timeA.split(":");
//       let millisecond = time_partsA[0] * (60000 * 60) + time_partsA[1] * 60000;
//       let time_partsB = timeB.split(":");
//       let millisecondB = time_partsB[0] * (60000 * 60) + time_partsB[1] * 60000;
//       console.log(millisecond, millisecondB)
//       return millisecond - millisecondB
//       // return millisecondB - millisecond

//     });
//   };

//   useEffect(()=> {
//     getTripsInfo(tripsInfo)
//   },[getTripsInfo, tripsInfo])
//   console.log("object2")

//   return (
//     <>
//       {error && <p>{error}</p>}
//       {isLoading && <div>Loading...</div>}
//       {tripsInfo.length > 0 && !error && !isLoading && (
//         <div className={styles.container}>
//           <h3 className={styles.title}>
//             {" "}
//             Расписание автобусов{" "}
//             {getLocality(
//               stops,
//               trips.tripContainers[0].request.localityPairs[0][0]
//             )} - {getLocality(stops, trips.tripContainers[0].request.localityPairs[0][1])}
//             {/* на{" "}
//             {getDate()} */}
//           </h3>
//           <FilterButtons />
//           <button type="button" onClick={hClick}>
//             sort
//           </button>
//           {tripsInfo.map((el, idx) => (
//             <TripBox key={idx} trip={el} />
//           ))}
//           <pre>{JSON.stringify(trips, null, 4)}</pre>
//         </div>
//       )}
//     </>
//   );
// };

// ==========================================================

class TripsContainer extends Component {
  state = {
    timeInWay: "up",
    departureTime: "up",
    arrivalTime: "up",
    price: "up",
  };
  componentDidUpdate(prevProps, prevState) {
    const { trips, getTripsInfo } = this.props;

    if (prevProps.trips !== trips) {
      if (Object.keys(trips).length > 0) {
        getTripsInfo(Object.values(trips.segments));
      } else {
        getTripsInfo([]);
      }
    }
    // if (prevState.timeInWay !== this.state.timeInWay) {
    // }
  }

  filterTimeInWay = () => {
    const { timeInWay } = this.state;
    if (timeInWay === "up") this.setState({ timeInWay: "down" });
    if (timeInWay === "down") this.setState({ timeInWay: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a.timeInWay.split(":");
      const time_partsB = b.timeInWay.split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];

      return timeInWay === "up" ? A - B : B - A;
    });
  };
  filterDepartureTime = () => {
    const { departureTime } = this.state;
    if (departureTime === "up") this.setState({ departureTime: "down" });
    if (departureTime === "down") this.setState({ departureTime: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a.departureDate.split(" ")[1].split(":");
      const time_partsB = b.departureDate.split(" ")[1].split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];

      return departureTime === "up" ? A - B : B - A;
    });
  };
  filterArrivalTime = () => {
    const { arrivalTime } = this.state;
    if (arrivalTime === "up") this.setState({ arrivalTime: "down" });
    if (arrivalTime === "down") this.setState({ arrivalTime: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const time_partsA = a.arrivalDate.split(" ")[1].split(":");
      const time_partsB = b.arrivalDate.split(" ")[1].split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];

      return arrivalTime === "up" ? A - B : B - A;
    });
  };

  filterPrice = () => {
    const { price } = this.state;
    if (price === "up") this.setState({ price: "down" });
    if (price === "down") this.setState({ price: "up" });
    this.props.tripsInfo.sort((a, b) => {
      const A = a.price.amount;
      const B = b.price.amount;
      return price === "up" ? A - B : B - A;
    });
  };

  render() {
    const { error, isLoading, tripsInfo, stops, trips } = this.props;
    return (
      <>
        {error && <p>{error}</p>}
        {isLoading && <div>Loading...</div>}
        {tripsInfo.length > 0 && !error && !isLoading && (
          <div className={styles.container}>
            <h3 className={styles.title}>
              {" "}
              Расписание автобусов{" "}
              {getLocality(
                stops,
                trips.tripContainers[0].request.localityPairs[0][0]
              )} -{" "}
              {getLocality(stops, trips.tripContainers[0].request.localityPairs[0][1])}
              {/* на{" "}
            {getDate()} */}
            </h3>
            <FilterButtons
              filterTimeInWay={this.filterTimeInWay}
              filterDepartureTime={this.filterDepartureTime}
              filterArrivalTime={this.filterArrivalTime}
              filterPrice={this.filterPrice}
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
