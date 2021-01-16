import { Types } from '../actionsTypes';

export const fetchTripsStart = () => ({
  type: Types.FETCH_TRIPS_START,
  // payload: bool
})
export const fetchTripsSuccess = trips => ({
  type: Types.FETCH_TRIPS_SUCCESS,
  payload: trips,
});
export const fetchTripsError = err => ({
    type: Types.FETCH_TRIPS_ERROR,
    payload: err
})
export const getTripsInfo = trips => ({
  type: Types.GET_TRIPS_INFO,
  payload: trips
})
export const changeIsVisible = bool => ({
  type: Types.CHANGE_IS_VISIBLE_TRIPS,
  payload: bool
})



