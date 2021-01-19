import { Types } from "../actionsTypes";

export const changeIsVisibleOrder = (bool) => ({
  type: Types.CHANGE_IS_VISIBLE_ORDER,
  payload: bool,
});

export const fetchOrderInfo = (obj) => ({
  type: Types.FETCH_ORDER_INFO,
  payload: obj,
});

export const fetchAmountPassanger = (arr) => ({
  type: Types.AMOUNT_PASSANGER,
  payload: arr,
});

export const SendInfoPassanger = (obj) => ({
  type: Types.SEND_INFO_PASSANGER,
  payload: obj 
})
