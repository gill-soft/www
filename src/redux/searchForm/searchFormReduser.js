import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getInputValueFrom = (state = "Львов", { type, payload }) => {
  switch (type) {
    case Types.INPUT_VALUE_FROM:
      return payload;

    default:
      return state;
  }
};
const getInputValueTo = (state = "Киев", { type, payload }) => {
  switch (type) {
    case Types.INPUT_VALUE_TO:
      return payload;

    default:
      return state;
  }
};
const getInputValueDate = (state = new Date(), { type, payload }) => {
  switch (type) {
    case Types.INPUT_DATE:
      return payload;

    default:
      return state;
  }
};
const getAmountPassanger = (state = 1, { type, payload }) => {
  switch (type) {
    case Types.INCREMENT_AMOUNT_PASSANGER:
      return state + 1;
    case Types.DECREMENT_AMOUNT_PASSANGER:
      return state - 1;
    default:
      return state;
  }
};

export const searchFormReduser = combineReducers({
  from: getInputValueFrom,
  to: getInputValueTo,
  date: getInputValueDate,
  amountPassanger: getAmountPassanger,
});
