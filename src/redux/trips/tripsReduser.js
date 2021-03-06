import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getTrips = (state = null, { type, payload }) => {
  switch (type) {
    case Types.FETCH_TRIPS_SUCCESS:
      return payload;

    default:
      return state;
  }
};

const getSortTypeSingle = (state = "price", { type, payload }) => {
  switch (type) {
    case Types.GET_SORT_TYPE_SINGLE:
      return payload;

    default:
      return state;
  }
};

const getSortTypeDouble = (state = "price", { type, payload }) => {
  switch (type) {
    case Types.GET_SORT_TYPE_DOUBLE:
      return payload;

    default:
      return state;
  }
};

const getIsShowSortBox = (state = false, { type, payload }) => {
  switch (type) {
    case Types.GET_SHOW_SORT_BOX:
      return payload;

    default:
      return state;
  }
};
const getIsShowSortBoxDouble = (state = false, { type, payload }) => {
  switch (type) {
    case Types.GET_SHOW_SORT_BOX_DOUBLE:
      return payload;

    default:
      return state;
  }
};


export const tripsReduser = combineReducers({
  trips: getTrips,
  sortTypeSingle: getSortTypeSingle,
  sortTypeDouble: getSortTypeDouble,
  isShowSortBox: getIsShowSortBox,
  isShowSortBoxDouble: getIsShowSortBoxDouble,
});
