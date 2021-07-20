import { Types } from "../actionsTypes";

export const setTripKeys = (arr) => ({
  type: Types.FETCH_TRIP_KEYS,
  payload: arr,
});

export const fetchTicket = (ticket) => ({
  type: Types.FETCH_TICKET,
  payload: ticket,
});

export const setAdditionalServices = (arr) => ({
  type: Types.ADDITIONAL_SERVICES,
  payload: arr,
});
export const setWallet =(obj) =>({
  type: Types.GET_WALLET,
  payload: obj
})
