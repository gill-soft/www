import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getTrips = (state = {}, { type, payload }) => {
  switch (type) {
    case Types.FETCH_TRIPS_SUCCESS:
      return payload;

    default:
      return state;
  }
};

const getTripsInfo = (state = [], { type, payload }) => {
  switch (type) {
    case Types.GET_TRIPS_INFO:
      return payload;

    default:
      return state;
  }
};

export const tripsReduser = combineReducers({
  trips: getTrips,
  tripsInfo: getTripsInfo,
});
