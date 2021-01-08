import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import TripBox from "./TripBox";

const TripsContainer = ({ trips, isLoading, error }) => {
  const [tripsKey, setState] = useState([]);
  useEffect(() => {
    if (Object.keys(trips).length > 0) {
      setState(Object.keys(trips.segments));
    }
  }, [trips]);

  return (
    <>
      {error && <p>{error}</p>}
      {isLoading && <div>Loading...</div>}
      {(tripsKey.length > 0 && !error) && tripsKey.map((key) => <TripBox key={key} tripKey={key} />)}
    </>
  );
};

const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  isLoading: state.trips.isLoading,
  error: state.trips.error,
});
export default connect(mapStateToProps)(TripsContainer);
