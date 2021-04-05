import axios from "axios";
const baseURLcontrol = "https://busis.eu/gds-control/api/v1";
const baseURLsale = "https://busis.eu/gds-sale/api/v1";

const AUTH_KEY = `Basic ${Buffer.from("busfor_test:busfor_test").toString("base64")}`;
const AUTH_KEY2 = `Basic ${Buffer.from("380888888880:8111").toString("base64")}`;

//  ==== получение всех остановок ==== //
export const getAllStops = () => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/locality/all`,
    headers: {
      Authorization: AUTH_KEY2,
    },
  });
};

// ==== инициализация поиска ==== //
export const getInitialization = ({ idFrom, idWhereTo, date }, lang) => {
  return axios({
    method: "post",
    url: `${baseURLcontrol}/search`,
    
    headers: {
      Authorization: AUTH_KEY2,
    },
    data: {
      id: "string",
      // lang: `${lang}`,
      localityPairs: [[`${idFrom}`, `${idWhereTo}`]],
      dates: [`${date}`],
      currency: "UAH",
      maxConnections: 1,
    },
  });
};

//  ==== поиск поездок ==== //
export const searchTrips = (id) => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/search/${id}`,
    headers: {
      Authorization: AUTH_KEY2,
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

// ==== доступные места ==== //
export const getRequaredFieldsS = (key) => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/search/trip/${key}/seats`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};

// ==== запрос на билет ==== //
export const toBookTicket = (body) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/order/with_payment_params/PORTMONE`,
    headers: {
      Authorization: AUTH_KEY2,
    },
    data: body,
  });
};

// ==== информация о билете ==== //
export const getTicketInfo = (id) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/order/${id}`,
    headers: {
      Authorization: AUTH_KEY2,
    },
  });
};
// ==== подтверждение покупки билете ==== //
export const getTicketConfirm = (id) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/order/${id}/confirm/CASH`,
    headers: {
      Authorization: AUTH_KEY2,
    },
  });
};

// ==== получение билета для печати ==== //
export const getTicketPrint = (id, lang) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/order/${id}/document/${lang}`,
    headers: {
      Authorization: AUTH_KEY2,
    },
  });
};

// ==== все населенные пункты ==== //
export const getCities = (val, lang) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/locality/cities/${lang}?prefix=${val}`,
    headers: {
      Authorization: AUTH_KEY2,
    },
  });
};