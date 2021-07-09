import { createSelector } from "reselect";
import { getPrice } from "../../services/getInfo";

export const getTrips = (state) => state.trips.trips;

export const getSingleTrips = createSelector(getTrips, (trips) =>
  trips.tripContainers
    .reduce((arr, el) => {
      arr.push(el.trips);
      return arr;
    }, [])
    .flat()
    .filter((el) => Object.keys(el)[0] === "id")
    .sort((a, b) => trips.segments[a.id].price.amount - trips.segments[b.id].price.amount)
    .map((el) => ({ id: [el.id] }))
);

export const getDoubleTrips = createSelector(getTrips, (trips) =>
  trips.tripContainers
    .reduce((arr, el) => {
      arr.push(el.trips);
      return arr;
    }, [])
    .flat()
    .filter((el) => Object.keys(el)[0] === "segments")
    .sort((a, b) => getPrice(a.segments, trips) - getPrice(b.segments, trips))
);
