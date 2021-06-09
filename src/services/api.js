import axios from "axios";
const baseURLcontrol = "https://busis.eu/gds-control/api/v1";
const baseURLsale = "https://busis.eu/gds-sale/api/v1";
// const AUTH_KEY2 = `Basic ${Buffer.from("busfor_test:busfor_test").toString("base64")}`;
const AUTH_KEY = `Basic ${Buffer.from('380888888880:8111').toString(
  "base64"
)}`;

//  ==== получение всех остановок ==== //
// export const getAllStops = () => {
//   return axios({
//     method: "get",
//     url: `${baseURLcontrol}/locality/all`,
//     headers: {
//       Authorization: process.env.REACT_APP_AUTH_KEY2,
//     },
//   });
// };
// ==== поиск городов для автокомплита ==== //
export const getCities = (val, lang) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/locality/cities/${lang}?prefix=${val}`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};
// ==== инициализация поиска ==== //
export const getInitialization = ({ idFrom, idTo, date }, lang) => {
  return axios({
    method: "post",
    url: `${baseURLcontrol}/search`,
    headers: {
      Authorization: AUTH_KEY,
    },
    data: {
      id: "string",
      // lang: `${lang}`,
      localityPairs: [[idFrom, idTo]],
      dates: [date],
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
      Authorization: AUTH_KEY,
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
      Authorization: AUTH_KEY,
    },
  });
};

//  ==== googlePay confirm ==== //
export const isGooglePayComfirm = (body, orderId, paymentParamsId) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/transaction/gPay/${orderId}/${paymentParamsId}`,
    headers: {
      Authorization: AUTH_KEY,
      "Content-Type": "application/json",
    },
    data: body,
  });
};

// ==== подтвердждение оплаты ==== //
export const ticketComfirm = (orderId, paymentParamsId) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/order/${orderId}/confirm/AQUIRING/${paymentParamsId}`,
    headers: {
      Authorization: AUTH_KEY,
      "Content-Type": "application/json",
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
// ==== поаулярные маршруты ==== //

export const getPopularRouts = () => {
  return axios({
    method: "get",
    url: `${baseURLsale}/search/trips`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};
