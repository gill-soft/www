import axios from 'axios';
const baseUrl = 'https://busis.eu/gds-control/api/v1';
const localityAll = '/locality/all';
// const AUTH_KEY = 'Basic Y2Fycmllcl90ZXN0OnRlc3RfY2Fycmllcg==';
const AUTH_KEY2 = `Basic ${Buffer.from("busfor_test:busfor_test").toString("base64")}`

//  ==== получение всех остановок ==== //
export const getAllStops = () => {
  return axios({
    method: 'get',
    url: `${baseUrl}${localityAll}`,
    headers: {
      Authorization: AUTH_KEY2,
    },
  });
};

// ==== инициализация поиска ==== //
export const getInitialization = ({ idFrom, idWhereTo, date }) => {
  return axios({
    method: 'post',
    url: 'https://busis.eu/gds-control/api/v1/search',
    headers: {
      Authorization: AUTH_KEY2,
    },
    data: {
      id: 'string',
      lang: 'UA',
      localityPairs: [[`${idFrom}`, `${idWhereTo}`]],
      dates: [`${date}`],
      currency: 'UAH',
      // maxConnections: 0,
    },
  });
};

//  ==== поиск поездок ==== //
export const searchTrips = id => {
  return axios({
    method: 'get',
    url: `${baseUrl}/search/${id}`,
    headers: {
      Authorization: AUTH_KEY2,
    },
  });
};

// ===============не удалять==========
// 698c04d5-b503-4415-88f9-a6e757cdec7d
//  carrier_test
// test_carrier
