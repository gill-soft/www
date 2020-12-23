import { Types } from '../types';

export const changeLanguage = value => ({
  type: Types.CHANGE_LANGUAGE,
  payload: value,
});
