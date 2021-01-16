import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { searchFormReduser } from "./searchForm/searchFormReduser";
import language from "./Language/languageReduser";
import { tripsReduser } from "./trips/tripsReduser";
import { orderReduser } from "./order/orderReduser";

const rootRedusers = combineReducers({
  searchForm: searchFormReduser,
  language: language,
  trips: tripsReduser,
  order: orderReduser
});
const enhancer = applyMiddleware(thunk);

const store = createStore(rootRedusers, composeWithDevTools(enhancer));

export default store;
