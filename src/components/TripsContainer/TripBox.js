import React from "react";
import { connect } from "react-redux";

const TripBox = ({ tripKey, trips }) => {
  // console.log(trips.segments[`${tripKey}`])
  return (
    <div>
      <h5>{trips.segments[`${tripKey}`].route.name.EN}</h5>
      {/* <pre>{JSON.stringify(trips.segments[`${tripKey}`], null, 2)}</pre> */}
    </div>
  );
};
const mapDispatchToProps = (state) => ({
  trips: state.trips.trips,
});

export default connect(mapDispatchToProps)(TripBox);
