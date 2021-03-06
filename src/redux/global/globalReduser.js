import { Types } from "../actionsTypes";
import { combineReducers } from "redux";


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
      return false;

    default:
      return state;
  }
};

export const globalReduser = combineReducers({
  error: getError,
  isLoading: getLoader,
});
