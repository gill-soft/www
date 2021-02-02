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

const getErrorStops = (state = "", { type, payload }) => {
  switch (type) {
    case Types.FETCH_ALL_STOPS_ERROR:
      return payload;

    default:
      return state;
  }
};

export const globalReduser = combineReducers({
  stops: getStops,
  error: getErrorStops,
});
