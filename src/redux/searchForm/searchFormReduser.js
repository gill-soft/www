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
const getInputValueFrom = (state = "Lviv", { type, payload }) => {
  switch (type) {
    case Types.INPUT_VALUE_FROM:
      return payload;

    default:
      return state;
  }
};
const getInputValueTo = (state = "Kiev", { type, payload }) => {
  switch (type) {
    case Types.INPUT_VALUE_TO:
      return payload;

    default:
      return state;
  }
};
const getInputValueDate = (state = new Date(), { type, payload }) => {
  switch (type) {
    case Types.INPUT_DATE:
      return payload;

    default:
      return state;
  }
};

export const searchFormReduser = combineReducers({
  stops: getStops,
  error: getErrorStops,
  from: getInputValueFrom,
  to: getInputValueTo,
  date: getInputValueDate,
});
