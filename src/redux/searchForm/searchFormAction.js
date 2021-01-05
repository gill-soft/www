import { Types } from '../actionsTypes';

export const fetchAllStopsSuccess = stops => ({
  type: Types.FETCH_ALL_STOPS_SUCCESS,
  payload: stops,
});
export const fetchAllStopsError = msg => ({
  type: Types.FETCH_ALL_STOPS_ERROR,
  payload: msg,
});

export const inputValueFrom = value => ({
  type: Types.INPUT_VALUE_FROM,
  payload: value,
});
export const inputValueTo = value => ({
  type: Types.INPUT_VALUE_TO,
  payload: value,
});
