import './styles.css';
import { handleInputClick, handlePresKey, chooseLocality, changeFromWhere } from './scripts/fetchLocality';
import { fetchAllStops } from './scripts/fetchAllStops';
import { changeLanguage } from './scripts/changeLanguage';
import { test } from './scripts/test';

const baseUrl = 'https://busis.eu/gds-control/api/v1';
const localityAll = '/locality/all';

// получаем весь список остановок в localStorage
fetchAllStops(`${baseUrl}${localityAll}`);
changeLanguage();
//отрисовка списка населенных пунктов
// fetchListLocality(changeLanguage());

// test("https://busis.eu/gds-control/api/v1/swagger-ui.html#/Trip_search/initSearchUsingPOST")
// ////////////////////////////////////////////////////////////////////
// const select = document.querySelector('#lenguage');
// let lang = 'RU';
// const change = () => {
//   lang = select.value;
//   console.log(lang);
// };
// select.addEventListener('change', change);


// DOM-nodes
const listLocality = document.querySelector('.listLocality');
const inputSearchFrom = document.querySelector('#inputSearchFrom');
const inputSearchWhereTo = document.querySelector('#inputSearchWhereTo');
const buttonChange = document.querySelector('#buttonChange');
// listeners
inputSearchFrom.addEventListener('keyup', handlePresKey);
inputSearchWhereTo.addEventListener('keyup', handlePresKey);

inputSearchFrom.addEventListener('click', handleInputClick);
inputSearchWhereTo.addEventListener('click', handleInputClick);

listLocality.addEventListener('click', chooseLocality);
buttonChange.addEventListener('click', changeFromWhere);
