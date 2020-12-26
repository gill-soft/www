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
  const getInputValueFrom = (state = '', { type, payload }) => {
    switch (type) {
      case Types.INPUT_VALUE_FROM:
        return payload;
        
      default:
        return state;
    }
  };
  const getInputValueTo = (state = '', { type, payload }) => {
    switch (type) {
      case Types.INPUT_VALUE_TO:
        return payload;
        
      default:
        return state;
    }
  };

  const getFilteredStops = (state = [], { type, payload }) => {
    switch (type) {
      case Types.GET_FILTERED_STOPS:
        return payload;
        
      default:
        return state;
    }
  };

  

export const searchFormReduser = combineReducers({
stops: getStops,
filteredStops: getFilteredStops,
from: getInputValueFrom,
to: getInputValueTo,
}) 