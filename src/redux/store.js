import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {searchFormReduser} from './searchForm/searchFormReduser'

const rootRedusers = combineReducers({
  searchForm: searchFormReduser
});
const enhancer = applyMiddleware(thunk);

const store = createStore(rootRedusers, composeWithDevTools(enhancer));

export default store;