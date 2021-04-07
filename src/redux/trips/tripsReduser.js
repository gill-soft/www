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

const getSortType = (state = 'price', { type, payload }) => {
  switch (type) {
    case Types.GET_SORT_TYPE:
      return payload;

    default:
      return state;
  }
};

const getIsShowSortBox = (state= false, {type, payload})=> {
  switch(type) {
    case Types.GET_SHOW_SORT_BOX:
      return payload;

      default:
        return state
  }
}

export const tripsReduser = combineReducers({
  trips: getTrips,
  tripsInfo: getTripsInfo,
  singleTrips: getSingleTrips,
  doubleTrips: getDoubleTrips,
  sortType: getSortType,
  isShowSortBox: getIsShowSortBox,
});
