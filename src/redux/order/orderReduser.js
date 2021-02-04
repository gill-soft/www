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

// const getInfoPassangers = (state = {}, { type, payload }) => {
//   switch (type) {
//     case Types.SEND_INFO_PASSANGER:
//       return payload;

//     default:
//       return state;
//   }
// };

export const orderReduser = combineReducers({
  order: getOrder,
  // infoPassangers: getInfoPassangers,
});
