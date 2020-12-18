import './styles.css';
import { fetchListLocality } from './scripts/fetchLocality';
import { fetchAllStops } from './scripts/fetchAllStops';

const baseUrl = 'https://busis.eu/gds-control/api/v1';
const localityAll = '/locality/all';

// получаем весь список остановок в localStorage
fetchAllStops(`${baseUrl}${localityAll}`);

//отрисовка списка населенных пунктов
fetchListLocality();


