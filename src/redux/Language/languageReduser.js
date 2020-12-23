import { Types } from '../types';
import { combineReducers } from 'redux';

const language = (state = 'RU', action) => {
  switch (action.type) {
    case Types.CHANGE_LANGUAGE:
      return action.payload;

    default:
      return state;
  }
};
export default language;
// export const selectedLanguage = combineReducers({
//   lang: language,
// });
