import { Types } from "../actionsTypes";
import { combineReducers } from "redux";

const getInputValueFrom = (state = { text: "", description: "" }, { type, payload }) => {
  switch (type) {
    case Types.INPUT_VALUE_FROM:
      return payload;

    default:
      return state;
  }
};

const getInputValueTo = (state = { text: "", description: "" }, { type, payload }) => {
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
const getTime = (state = "", { type, payload }) => {
  switch (type) {
    case Types.TIME:
      return payload;

    default:
      return state;
  }
};
const isOpenFrom = (state = false, { type, payload }) => {
  switch (type) {
    case Types.IS_OPEN_FROM:
      return payload;

    default:
      return state;
  }
};
const isOpenTo = (state = false, { type, payload }) => {
  switch (type) {
    case Types.IS_OPEN_TO:
      return payload;

    default:
      return state;
  }
};
const isOpenDate = (state = false, { type, payload }) => {
  switch (type) {
    case Types.IS_OPEN_DATE:
      return payload;

    default:
      return state;
  }
};

export const searchFormReduser = combineReducers({
  from: getInputValueFrom,
  to: getInputValueTo,
  date: getInputValueDate,
  amountPassanger: getAmountPassanger,
  time: getTime,
  isOpenFrom: isOpenFrom,
  isOpenTo: isOpenTo,
  isOpenDate: isOpenDate,
});
