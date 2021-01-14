import { Types } from '../actionsTypes';

const language = (state = 'RU', { type, payload }) => {
  switch (type) {
    case Types.CHANGE_LANGUAGE:
      return payload;

    default:
      return state;
  }
};
export default language;

