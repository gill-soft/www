import { Types } from "../actionsTypes";

export const fetchTripsSuccess = (trips) => ({
  type: Types.FETCH_TRIPS_SUCCESS,
  payload: trips,
});

export const getTripsInfo = (trips) => ({
  type: Types.GET_TRIPS_INFO,
  payload: trips,
});
