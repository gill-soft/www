import { Types } from "../actionsTypes";

export const fetchOrderInfo = (obj) => ({
  type: Types.FETCH_ORDER_INFO,
  payload: obj,
});

export const fetchTicket = (ticket) => ({
  type: Types.FETCH_TICKET,
  payload: ticket,
});