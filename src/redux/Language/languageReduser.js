import { Types } from '../types';
import { combineReducers } from 'redux';

const language = (state = 'EN', { type, payload }) => {
  switch (type) {
    case Types.CHANGE_LANGUAGE:
      return payload;

    default:
      return state;
  }
};
export default language;
// export const selectedLanguage = combineReducers({
//   lang: language,
// });
