import { Types } from "../actionsTypes";

export const fetchOrderInfo = (obj) => ({
  type: Types.FETCH_ORDER_INFO,
  payload: obj,
});

// export const sendInfoPassanger = (arr) => ({
//   type: Types.SEND_INFO_PASSANGER,
//   payload: arr,
// });
