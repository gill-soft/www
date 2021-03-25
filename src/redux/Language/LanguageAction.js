import { Types } from '../actionsTypes';

export const changeLanguage = value => ({
  type: Types.CHANGE_LANGUAGE,
  payload: value,
});
