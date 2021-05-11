import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getTripKeys = (state = [], { type, payload }) => {
  switch (type) {
    case Types.FETCH_TRIP_KEYS:
      return payload;

    default:
      return state;
  }
};

const getTicket = (state = {}, { type, payload }) => {
  switch (type) {
    case Types.FETCH_TICKET:
      return payload;

    default:
      return state;
  }
};
const getAdditionalServices = (state= [], {type, payload})=>{
  switch (type) {
    case Types.ADDITIONAL_SERVICES:
      return payload;

    default:
      return state;
  }
}

export const orderReduser = combineReducers({
  tripKeys: getTripKeys,
  ticket: getTicket,
  additionalServicesKeys: getAdditionalServices
});
