import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import FormForBuy from "./FormForBuy";

const TripBox = ({ tripKey, trips, isLoading }) => {
  const [isForm, setIsForm] = useState(false);
  

  return (
    <div>
      {!isLoading && (
        <div>
          <h5>{trips.segments[`${tripKey}`].route.name.EN}</h5>
          <Button onClick={() => setIsForm(true)}>BUY!</Button>
          {isForm && <FormForBuy />}
        </div>
      )}

      <pre>{JSON.stringify(trips, null, 2)}</pre>
    </div>
  );
};
const mapStateToProps = (state) => ({
  trips: state.trips.trips,
  isLoading: state.trips.isLoading,
});

export default connect(mapStateToProps)(TripBox);
