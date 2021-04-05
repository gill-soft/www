import { Types } from "../actionsTypes";

export const fetchTripsSuccess = (trips) => ({
  type: Types.FETCH_TRIPS_SUCCESS,
  payload: trips,
});

export const getTripsInfo = (trips) => ({
  type: Types.GET_TRIPS_INFO,
  payload: trips,
});

export const changeSortType = (val) => ({
  type: Types.GET_SORT_TYPE,
  payload: val,
});

export const changeSortBoxShow = (bool)=> ({
  type: Types.GET_SHOW_SORT_BOX,
  payload: bool
})
