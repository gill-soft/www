import { Types } from "../actionsTypes";

export const fetchTripsSuccess = (trips) => ({
  type: Types.FETCH_TRIPS_SUCCESS,
  payload: trips,
});

export const getTripsInfo = (trips) => ({
  type: Types.GET_TRIPS_INFO,
  payload: trips,
});

export const setSingleTrips = (trips) => ({
  type: Types.GET_SINGLE_TRIPS,
  payload: trips,
});

export const setDoubleTrips = (trips) => ({
  type: Types.GET_DOUBLE_TRIPS,
  payload: trips,
});

export const changeSortTypeSingle = (val) => ({
  type: Types.GET_SORT_TYPE_SINGLE,
  payload: val,
});
export const changeSortTypeDouble = (val) => ({
  type: Types.GET_SORT_TYPE_DOUBLE,
  payload: val,
});

export const changeSortBoxShow = (bool) => ({
  type: Types.GET_SHOW_SORT_BOX,
  payload: bool,
});
export const changeSortBoxShowDouble = (bool) => ({
  type: Types.GET_SHOW_SORT_BOX_DOUBLE,
  payload: bool,
});
export const setIsTrips = (bool) => ({
  type: Types.GET_IS_TRIPS,
  payload: bool
});
