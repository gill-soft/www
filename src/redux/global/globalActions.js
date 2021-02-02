import { Types } from '../actionsTypes';

export const fetchAllStops = stops => ({
    type: Types.FETCH_ALL_STOPS_SUCCESS,
    payload: stops,
  });
  export const fetchError = msg => ({
    type: Types.FETCH_ALL_STOPS_ERROR,
    payload: msg,
  });