import { Types } from "../actionsTypes";

export const setTripKeys = (arr) => ({
  type: Types.FETCH_TRIP_KEYS,
  payload: arr,
});

export const fetchTicket = (ticket) => ({
  type: Types.FETCH_TICKET,
  payload: ticket,
});