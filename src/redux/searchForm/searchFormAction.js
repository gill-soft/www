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

export const setTime = (time) => ({
  type: Types.TIME,
  payload: time,
});
export const setIsOpenFrom = (bool) => ({
  type: Types.IS_OPEN_FROM,
  payload: bool,
});
export const setIsOpenTo = (bool) => ({
  type: Types.IS_OPEN_TO,
  payload: bool,
});
export const setIsOpenDate = (bool) => ({
  type: Types.IS_OPEN_DATE,
  payload: bool,
});
