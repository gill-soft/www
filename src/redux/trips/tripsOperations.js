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
  console.log("search");
  let deltaTime = Date.now() - time;
  if (deltaTime <= 500) {
    searchTrips(id)
      .then(({ data }) => {
        console.log("1", data);
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
          console.log("2", data);

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
          console.log("3");

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
    dispatch(stopLoader());
    dispatch(setIsTrips(false));
  }
};

const TripsSuccess = (data) => (dispatch) => {
  dispatch(setSingleTrips([]));
  dispatch(setDoubleTrips([]));
  const allTrips = data.tripContainers
    .reduce((arr, el) => {
      arr.push(el.trips);
      return arr;
    }, [])
    .flat();
  const singleTrips = allTrips
    .filter((el) => Object.keys(el)[0] === "id")
    .sort((a, b) => data.segments[a.id].price.amount - data.segments[b.id].price.amount);
  const doubleTrips = allTrips
    .filter((el) => Object.keys(el)[0] === "segments")
    .sort((a, b) => getPrice(a.segments, data) - getPrice(b.segments, data));
  dispatch(changeSortTypeSingle("price"));
  dispatch(changeSortTypeDouble("price"));
  dispatch(fetchTripsSuccess(data));
  dispatch(setSingleTrips(singleTrips));
  dispatch(setDoubleTrips(doubleTrips));
};
