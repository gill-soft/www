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
// const getFromId = (state = "", { type, payload }) => {
//   switch (type) {
//     case Types.FROM_ID:
//       return payload;

//     default:
//       return state;
//   }
// };
const getInputValueTo = (state = {text: "", description: ""}, { type, payload }) => {
  switch (type) {
    case Types.INPUT_VALUE_TO:
      return payload;

    default:
      return state;
  }
};
// const getToId = (state = "", { type, payload }) => {
//   switch (type) {
//     case Types.TO_ID:
//       return payload;

//     default:
//       return state;
//   }
// };
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

export const searchFormReduser = combineReducers({
  from: getInputValueFrom,
  // fromID: getFromId,
  to: getInputValueTo,
  // toID: getToId,
  date: getInputValueDate,
  amountPassanger: getAmountPassanger,
  time: getTime,
});
