import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getTrips = (state = [], { type, payload }) => {
  switch (type) {
    case Types.FETCH_TRIPS_SUCCESS:
      return [...state, payload];

    default:
      return state;
  }
};
const tripsError = (state = "", { type, payload }) => {
  switch (type) {
    case Types.FETCH_TRIPS_ERROR:
      return payload;

    default:
      return state;
  }
};

export const tripsReduser = combineReducers({
  trips: getTrips,
  error: tripsError,
});
