import { Types } from "../types";


export const fetchAllStopsSuccess = (stops) => ({
  type: Types.FETCH_ALL_STOPS_SUCCESS,
  payload: stops,
});

