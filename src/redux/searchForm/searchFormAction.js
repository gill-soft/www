import { Types } from "../actionsTypes";

export const inputValueFrom = (value) => ({
  type: Types.INPUT_VALUE_FROM,
  payload: value,
});
export const inputValueTo = (value) => ({
  type: Types.INPUT_VALUE_TO,
  payload: value,
});
export const inputValueDate = (date) => ({
  type: Types.INPUT_DATE,
  payload: date,
});

export const incrementAmountPassangers = () => ({
  type: Types.INCREMENT_AMOUNT_PASSANGER,
});

export const decrementAmountPassangers = () => ({
  type: Types.DECREMENT_AMOUNT_PASSANGER,
});
