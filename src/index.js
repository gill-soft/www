import './styles.css';
import { fetchListLocality } from './scripts/fetchLocality';
import { fetchAllStops } from './scripts/fetchAllStops';
import { changeLanguage } from './scripts/changeLanguage';
import { test } from './scripts/test';

const baseUrl = 'https://busis.eu/gds-control/api/v1';
const localityAll = '/locality/all';

// получаем весь список остановок в localStorage
fetchAllStops(`${baseUrl}${localityAll}`);
changeLanguage();
//отрисовка списка населенных пунктов
fetchListLocality(changeLanguage());

// test("https://busis.eu/gds-control/api/v1/swagger-ui.html#/Trip_search/initSearchUsingPOST")
// ////////////////////////////////////////////////////////////////////
const select = document.querySelector('#lenguage');
let lang = 'RU';
const change = () => {
  lang = select.value;
  console.log(lang);
};
select.addEventListener('change', change);
