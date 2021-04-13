import { searchTrips } from "../../services/api";
import { getPrice } from "../../services/getInfo";
import { getError, stopLoader } from "../global/globalActions";
import {
  changeSortTypeDouble,
  changeSortTypeSingle,
  fetchTripsSuccess,
  setDoubleTrips,
  setIsTrips,
  setSingleTrips,
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
            dispatch(setIsTrips(false));
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
              dispatch(setIsTrips(false));
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
              dispatch(setIsTrips(false));
            }
          }
        })
        .catch(({ err }) => getError(err));
    }, 2000);
  } else {
    console.log("object");
    dispatch(stopLoader());
    dispatch(setIsTrips(false));
  }
};

const TripsSuccess = (data) => (dispatch) => {
  const singleTrips = data.tripContainers[0].trips
    .filter((el) => Object.keys(el)[0] === "id")
    .sort((a, b) => data.segments[a.id].price.amount - data.segments[b.id].price.amount);
  const doubleTrips = data.tripContainers[0].trips
    .filter((el) => Object.keys(el)[0] === "segments")
    .sort((a, b) => getPrice(a.segments, data) - getPrice(b.segments, data));
  dispatch(changeSortTypeSingle("price"));
  dispatch(changeSortTypeDouble("price"));
  dispatch(fetchTripsSuccess(data));
  dispatch(setSingleTrips(singleTrips));
  dispatch(setDoubleTrips(doubleTrips));
};
