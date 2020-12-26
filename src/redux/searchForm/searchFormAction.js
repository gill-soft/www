import { Types } from "../types";


export const fetchAllStopsSuccess = (stops) => ({
  type: Types.FETCH_ALL_STOPS_SUCCESS,
  payload: stops,
});

export const inputValueFrom = (value) => ({
  type: Types.INPUT_VALUE_FROM,
  payload: value,
});
export const inputValueTo = (value) => ({
  type: Types.INPUT_VALUE_TO,
  payload: value,
});
export const getFilteredStops = (value) => ({
  type: Types.GET_FILTERED_STOPS,
  payload: value,
});