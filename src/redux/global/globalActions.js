import { Types } from "../actionsTypes";

export const fetchAllStops = (stops) => ({
  type: Types.FETCH_ALL_STOPS_SUCCESS,
  payload: stops,
});

export const getError = (err) => ({
  type: Types.GET_ERROR,
  payload: err,
});

export const startLoader = () => ({
  type: Types.START_LOADER,
});
export const stopLoader = () => ({
    type: Types.FINISH_LOADER,
  });
