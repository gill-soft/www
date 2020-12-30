import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import SearchForm from './scripts/components/SearchForm/SearchForm';
import store from './redux/store';
import { Provider } from 'react-redux';
import LanguageSelect from './scripts/components/Language/LanguageSelect';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageSelect />
    </Provider>
  </React.StrictMode>,
  document.getElementById('language'),
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SearchForm />
    </Provider>
  </React.StrictMode>,
  document.getElementById('searchForm'),
);
