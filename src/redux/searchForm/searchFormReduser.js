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
  const getErrorStops = (state = '', { type, payload }) => {
    switch (type) {
      case Types.FETCH_ALL_STOPS_ERROR:
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
  const getClassName = (state = '', { type, payload }) => {
    switch (type) {
      case Types.GET_CLASS_NAME:
        return payload;
        
      default:
        return state;
    }
  };

  const toggleIsVisible = (state = false, { type, payload }) => {
    switch (type) {
      case Types.IS_VISIBLE:
        return !state;
        
      default:
        return state;
    }
  };

  

export const searchFormReduser = combineReducers({
stops: getStops,
error: getErrorStops,
filteredStops: getFilteredStops,
from: getInputValueFrom,
to: getInputValueTo,
className: getClassName,
isVisible: toggleIsVisible
}) 