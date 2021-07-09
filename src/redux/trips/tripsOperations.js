import { searchTrips } from "../../services/api";
import { getError, stopLoader } from "../global/globalActions";
import {
  changeSortTypeDouble,
  changeSortTypeSingle,
  fetchTripsSuccess,
} from "./tripsActions";

export const searchRouts = (id, time, requestData) => (dispatch) => {
  let deltaTime = Date.now() - time;
  if (deltaTime <= 500) {
    searchTrips(id)
      .then(({ data }) => {
        if (data.searchId) {
          dispatch(searchRouts(data.searchId, time, requestData));
        } else {
          if (data.segments) {
            dispatch(TripsSuccess(data));
          } else {
            dispatch(fetchTripsSuccess(null));
          }
        }
      })
      .catch((err) => getError(err.message));
  } else if (deltaTime <= 3000) {
    setTimeout(() => {
      searchTrips(id)
        .then(({ data }) => {
          if (data.searchId) {
            dispatch(searchRouts(data.searchId, time, requestData));
          } else {
            if (data.segments) {
              dispatch(TripsSuccess(data));
            } else {
              dispatch(fetchTripsSuccess(null));
            }
          }
        })
        .catch((err) => getError(err));
    }, 300);
  } else if (deltaTime > 3000 && deltaTime < 20000) {
    setTimeout(() => {
      searchTrips(id)
        .then(({ data }) => {
          if (data.searchId) {
            dispatch(searchRouts(data.searchId, time, requestData));
          } else {
            if (data.segments) {
              dispatch(TripsSuccess(data));
            } else {
              dispatch(fetchTripsSuccess(null));
            }
          }
        })
        .catch(({ err }) => getError(err));
    }, 2000);
  } else {
    dispatch(stopLoader());
    dispatch(fetchTripsSuccess(null));
  }
};

const TripsSuccess = (data) => (dispatch) => {
  dispatch(changeSortTypeSingle("price"));
  dispatch(changeSortTypeDouble("price"));
  dispatch(fetchTripsSuccess(data));
};
