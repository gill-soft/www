import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const tripsStart = (state = false, { type, payload }) => {
  switch (type) {
    case Types.FETCH_TRIPS_START:
      return true;
    case Types.FETCH_TRIPS_SUCCESS:
    case Types.FETCH_TRIPS_ERROR:
      return false;

    default:
      return state;
  }
};

const getTrips = (state = {}, { type, payload }) => {
  switch (type) {
    case Types.FETCH_TRIPS_SUCCESS:
      return payload;

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
const getTripsInfo = (state = [], { type, payload }) => {
  switch (type) {
    case Types.GET_TRIPS_INFO:
      return payload;

    default:
      return state;
  }
};
const changeIsVisible = (state = false, {type, payload}) => {
  switch (type) {
    case Types.CHANGE_IS_VISIBLE_TRIPS:
      return payload
      
  
    default:
      return state
  }
}


export const tripsReduser = combineReducers({
  trips: getTrips,
  tripsInfo: getTripsInfo,
  error: tripsError,
  isLoading: tripsStart,
  isVisibleTrips: changeIsVisible

});
