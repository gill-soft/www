import React from "react";
import { connect } from "react-redux";

const TripBox = ({ tripKey, trips, isLoading,  }) => {
  return (
    <div>
       {!isLoading && <h5>{trips.segments[`${tripKey}`].route.name.EN}</h5>}
      
      {/* <pre>{JSON.stringify(trips.segments[`${tripKey}`], null, 2)}</pre> */}
    </div>
  );
};
const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  isLoading: state.trips.isLoading,

});

export default connect(mapStateToProps)(TripBox);
