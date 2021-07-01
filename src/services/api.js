import axios from "axios";
const baseURLcontrol = "https://busis.eu/gds-control/api/v1";
const baseURLsale = "https://busis.eu/gds-sale/api/v1";
// const AUTH_KEY2 = `Basic ${Buffer.from("busfor_test:busfor_test").toString("base64")}`;
const storage = JSON.parse(localStorage.getItem("auth"));
const passwordLogin = storage?.login + ":" + storage?.password;
const auth = `Basic ${Buffer.from(passwordLogin).toString("base64")}`;
const AUTH_KEY = storage
  ? auth
  : `Basic ${Buffer.from("380888888880:8111").toString("base64")}`;

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

// ==== Авторизация Агента ==== //
export const getAuthorization = (login, password) => {
  const passwordLogin = login + ":" + password;
  const auth = `Basic ${Buffer.from(passwordLogin).toString("base64")}`;
  return axios({
    method: "post",
    url: `${baseURLsale}/client/user/auth`,
    headers: {
      Authorization: auth,
    },
  });
};
// ==== Активные заказы ==== //
export const getActivOrders = () => {
  return axios({
    method: "get",
    url: `${baseURLsale}/tickets/active/RU`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};
// ==== Активные заказы за период ==== //
export const getActivOrdersByPeriod = (start, end) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/tickets/by_period/RU?from=${start}&to=${end}`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};
// ==== Инициализация дополнительных сервисов ==== //
export const getInitializationServices = (orderId, services) => {
  return axios({
    method: "post",
    url: `${baseURLcontrol}/additional`,
    headers: {
      Authorization: AUTH_KEY,
    },
    data: {
      id: "7defe2a0-3dba-4199-aa4b-e7e651b8f9ca",
      currency: "UAH",
      order: {
        orderId: orderId,
        services: services,
      },
    },
  });
};

// ==== поиск дополнительных сервисов ==== //
export const getAdditionalServices = (searchId) => {
  return axios({
    method: "get",
    url: `${baseURLcontrol}/additional/${searchId}`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};

// ==== обновление заказа с дополнительными сервисами ==== //
export const updateTicketWithServices = (orderId, data) => {
  return axios({
    method: "post",
    url: `${baseURLcontrol}/order/${orderId}/service/add`,
    headers: {
      Authorization: AUTH_KEY,
    },
    data: data,
  });
};
