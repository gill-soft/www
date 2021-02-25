import axios from "axios";
const baseURLcontrol = "https://busis.eu/gds-control/api/v1";
const baseURLsale = "https://busis.eu/gds-sale/api/v1";

const AUTH_KEY = `Basic ${Buffer.from("busfor_test:busfor_test").toString("base64")}`;

//  ==== получение всех остановок ==== //
export const getAllStops = () => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/locality/all`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};

// ==== инициализация поиска ==== //
export const getInitialization = ({ idFrom, idWhereTo, date }, lang) => {
  return axios({
    method: "post",
    url: `${baseURLcontrol}/search`,
    headers: {
      Authorization: AUTH_KEY,
    },
    data: {
      id: "string",
      // lang: `${lang}`,
      localityPairs: [[`${idFrom}`, `${idWhereTo}`]],
      dates: [`${date}`],
      currency: "UAH",
      // maxConnections: 0,
    },
  });
};

//  ==== поиск поездок ==== //
export const searchTrips = (id) => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/search/${id}`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};
// ==== список обезательных полей ==== //
export const getRequaredFields = (key) => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/search/trip/${key}/required`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};

//  ==== запрос на билет ==== //
export const toBook = (body) => {
  return axios({
    method: "post",
    url: `${baseURLcontrol}/order`,
    headers: {
      Authorization: AUTH_KEY,
    },
    data: body,
  });
};

// ==== информация о билете ==== //
export const getTicketInfo = (id) => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/order/${id}`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};

// ==== подтверждение покупки билете ==== //
export const getTicketConfirm = (id) => {
  return axios({
    method: "post",
    url: `${baseURLcontrol}/order/${id}/confirm/CASH`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};

// ==== получение билета для печати ==== //
export const getTicketPrint = (id, lang) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/order/${id}/document/${lang}`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};
