import React, { useState, useEffect } from "react";
import { format} from "date-fns";
import ru from "date-fns/locale/ru";


import { connect } from "react-redux";
import TripBox from "./TripBox";

const TripsContainer = ({ trips, isLoading, error, from, to, date }) => {
  const [tripsKey, setState] = useState([]);
  useEffect(() => {
    if (Object.keys(trips).length > 0) {
      setState(Object.keys(trips.segments));
    }
  }, [trips]);

  const getDate = () => {
    return format(date, 'dd LLLL yyyy', {locale: ru})
  }
  return (
    <>
      {error && <p>{error}</p>}
      {isLoading && <div>Loading...</div>}
      {(tripsKey.length > 0 && !error && !isLoading) && (
        <div>
          <h3> Расписание автобусов {from} - {to} на {getDate()}</h3>
          {tripsKey.map((key) => <TripBox key={key} tripKey={key} />)}
        </div>
        )}
      <pre>{JSON.stringify(trips.segments, null, 2)}</pre>

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
});
export default connect(mapStateToProps)(TripsContainer);
