import React, { useState, useEffect } from "react";
// import { format } from "date-fns";
// import ru from "date-fns/locale/ru";
import { connect } from "react-redux";
import TripBox from "./TripBox";
import FilterButtons from "./FilterButtons";
import styles from './TripsContainer.module.css'
import { getLocality} from '../../services/getInfo'

const TripsContainer = ({ trips, isLoading, error, from, to, date, stops }) => {
  const [tripsKey, setTripsKey] = useState([]);
  const [tripsInfo, setTripsInfo] = useState([])
  useEffect(() => {
    if (Object.keys(trips).length > 0) {
      setTripsKey(Object.keys(trips.segments));
      setTripsInfo(Object.values(trips.segments))
    } else {
      setTripsInfo([])

    }
  }, [trips]);


  // const getDate = () => {
  //   // console.log(trips.tripContainers[0].request.dates[0]);
  //   const date2 = new Date(trips.tripContainers[0].request.dates[0]);
  //   return format(date2, "dd LLLL yyyy", { locale: ru });
  // };


  console.log("tripsInfo", tripsInfo)
  // const getLocality = (id) => {
  //   const result = stops.find((el) => el.id === id);
  //   return result.name["RU"];
  // };
  console.log(Boolean(Object.keys(trips).length))
  return (
    <>
      {error && <p>{error}</p>}
      {isLoading && <div>Loading...</div>}
      {tripsInfo.length > 0 && !error && !isLoading && (
        <div>
          <h3 className={styles.title}>
            {" "}
            Расписание автобусов{" "}
            {getLocality(stops, trips.tripContainers[0].request.localityPairs[0][0])} -{" "}
            {getLocality(stops, trips.tripContainers[0].request.localityPairs[0][1])}
             {/* на{" "}
            {getDate()} */}
          </h3>
          <FilterButtons />
          {tripsInfo.map((el, idx) => (
            <TripBox key={idx} trip={el} />
          ))}
      <pre>{JSON.stringify(trips, null, 4)}</pre>

        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  isLoading: state.trips.isLoading,
  error: state.trips.error,
  from: state.searchForm.from,
  to: state.searchForm.to,
  date: state.searchForm.date,
  stops: state.searchForm.stops,
});
export default connect(mapStateToProps)(TripsContainer);
