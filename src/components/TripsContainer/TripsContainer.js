import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import TripBox from "./TripBox";

const TripsContainer = ({ trips }) => {
  const [tripsKey, setState] = useState([]);
  useEffect(() => {
    if (Object.keys(trips).length > 0) {
      setState(Object.keys(trips.segments));
    }
  }, [trips]);
  // console.log(trips)
  //   console.log(state);
  return (
    <div>
      {tripsKey.length > 0 && tripsKey.map((key) => <TripBox key={key} tripKey={key} />)}
    </div>
  );
};

const mapStateToProps = (state) => ({
  trips: state.trips.trips,
});
export default connect(mapStateToProps)(TripsContainer);
