import './styles.css';
import {
  handleInputClick,
  handlePresKey,
  chooseLocality,
  changeFromWhere,
} from './scripts/fetchLocality';
import { fetchAllStops } from './scripts/fetchAllStops';
import { changeLanguage } from './scripts/changeLanguage';
import { test } from './scripts/test';
import { chooseLocalityKeyPres } from './scripts/chooseLocalityKeyPres';

// эндпоинты для запросов
const baseUrl = 'https://busis.eu/gds-control/api/v1';
const localityAll = '/locality/all';

// DOM-nodes
const listLocality = document.querySelector('.listLocality');
const inputSearchFrom = document.querySelector('#inputSearchFrom');
const inputSearchWhereTo = document.querySelector('#inputSearchWhereTo');
const buttonChange = document.querySelector('#buttonChange');

// получаем весь список остановок в localStorage
fetchAllStops(`${baseUrl}${localityAll}`);
// выбор языка страницы
changeLanguage();

// listeners
inputSearchFrom.addEventListener('keyup', handlePresKey);
inputSearchWhereTo.addEventListener('keyup', handlePresKey);

inputSearchFrom.addEventListener('click', handleInputClick);
inputSearchWhereTo.addEventListener('click', handleInputClick);

listLocality.addEventListener('click', chooseLocality);

buttonChange.addEventListener('click', changeFromWhere);

// ======================test React =================================
import React from 'react';
import ReactDOM from 'react-dom';
import SearchForm from './scripts/components/SearchForm/SearchForm';
import store from './redux/store';
import { Provider } from "react-redux";


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SearchForm />
    </Provider>
  </React.StrictMode>,
  document.getElementById('searchForm'),
);
