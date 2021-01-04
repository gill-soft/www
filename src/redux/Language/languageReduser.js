import { Types } from '../types';

const language = (state = 'EN', { type, payload }) => {
  switch (type) {
    case Types.CHANGE_LANGUAGE:
      return payload;

    default:
      return state;
  }
};
export default language;

