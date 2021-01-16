import { Types } from "../actionsTypes";

export const changeIsVisibleOrder = (bool) => ({
  type: Types.CHANGE_IS_VISIBLE_ORDER,
  payload: bool
});
