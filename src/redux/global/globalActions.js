import { Types } from "../actionsTypes";

export const getError = (err) => ({
  type: Types.GET_ERROR,
  payload: err,
});

export const startLoader = () => ({
  type: Types.START_LOADER,
});
export const stopLoader = () => ({
    type: Types.FINISH_LOADER,
  });
