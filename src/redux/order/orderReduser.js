import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getOrder = (state = {}, { type, payload }) => {
  switch (type) {
    case Types.FETCH_ORDER_INFO:
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

export const orderReduser = combineReducers({
  order: getOrder,
  ticket: getTicket
});
