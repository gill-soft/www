import {Types} from '../types'
import { combineReducers} from "redux";


 const inputFromValue = (state = '', { type, payload }) => {
    switch (type) {
      case Types.INPUT_FROM_VALUE:
        return payload;
        
      default:
        return state;
    }
  };

export const searchFormReduser = combineReducers({
inputFromValue: inputFromValue
}) 