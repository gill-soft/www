import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { searchFormReduser } from './searchForm/searchFormReduser';
import language from './Language/languageReduser';

const rootRedusers = combineReducers({
  searchForm: searchFormReduser,
  language,
});
const enhancer = applyMiddleware(thunk);

const store = createStore(rootRedusers, composeWithDevTools(enhancer));

export default store;
