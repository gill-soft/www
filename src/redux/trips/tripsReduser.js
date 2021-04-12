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

const getSingleTrips = (state = [], { type, payload }) => {
  switch (type) {
    case Types.GET_SINGLE_TRIPS:
      return payload;

    default:
      return state;
  }
};
const getDoubleTrips = (state = [], { type, payload }) => {
  switch (type) {
    case Types.GET_DOUBLE_TRIPS:
      return payload;

    default:
      return state;
  }
};

const getSortType = (state = "price", { type, payload }) => {
  switch (type) {
    case Types.GET_SORT_TYPE:
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
const getIsTrips = (state=true, {type, payload})=> {
  switch (type) {
    case Types.GET_IS_TRIPS:
      return payload;

    default:
      return state;
  }
}

export const tripsReduser = combineReducers({
  trips: getTrips,
  singleTrips: getSingleTrips,
  doubleTrips: getDoubleTrips,
  sortType: getSortType,
  isShowSortBox: getIsShowSortBox,
  isShowSortBoxDouble: getIsShowSortBoxDouble,
  isTrips: getIsTrips,
});
