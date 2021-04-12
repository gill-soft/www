import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getStops = (state = [], { type, payload }) => {
  switch (type) {
    case Types.FETCH_ALL_STOPS_SUCCESS:
      return payload;

    default:
      return state;
  }
};

const getError = (state = "", { type, payload }) => {
  switch (type) {
    case Types.GET_ERROR:
      return payload;

    default:
      return state;
  }
};

const getLoader = (state = false, { type, payload }) => {
  switch (type) {
    case Types.START_LOADER:
      return true;
    case Types.FINISH_LOADER:
    case Types.GET_ERROR:
    case Types.FETCH_TRIPS_SUCCESS:
        // case Types.GET_IS_TRIPS:
      // case Types.GET_TRIPS_INFO:
      return false;

    default:
      return state;
  }
};

export const globalReduser = combineReducers({
  stops: getStops,
  error: getError,
  isLoading: getLoader,
});
