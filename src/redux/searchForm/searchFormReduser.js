import {Types} from '../types'
import { combineReducers} from "redux";


 const getStops = (state = [], { type, payload }) => {
    switch (type) {
      case Types.FETCH_ALL_STOPS_SUCCESS:
        return payload;
        
      default:
        return state;
    }
  };

export const searchFormReduser = combineReducers({
stops: getStops
}) 