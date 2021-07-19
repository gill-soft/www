import axios from "axios";
const baseURLsale = "https://busis.eu/gds-sale/api/v1";
const storage = JSON.parse(localStorage.getItem("auth"));
const passwordLogin = storage?.login + ":" + storage?.password;
const AUTH_KEY = `Basic ${Buffer.from(passwordLogin).toString("base64")}`;

const getAuth = () => {
  return {
    Authorization: AUTH_KEY,
  };
};
const getAuthWithContentType = () => ({
  Authorization: AUTH_KEY,
  "Content-Type": "application/json",
});

// ==== поиск городов для автокомплита ==== //
export const getCities = (val, lang) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/locality/cities/${lang}?prefix=${val}`,
    headers: storage ? getAuth() : null,
  });
};

// ==== инициализация поиска ==== //
export const getInitialization = ({ idFrom, idTo, date }, lang) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/search`,
    headers: storage ? getAuth() : null,
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
    url: `${baseURLsale}/search/${id}`,
    headers: storage ? getAuth() : null,
  });
};

// ==== список обезательных полей ==== //
export const getRequaredFields = (key) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/search/trip/${key}/required`,
    headers: storage ? getAuth() : null,
  });
};

// ==== доступные места ==== //
export const getRequaredFieldsS = (key) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/search/trip/${key}/seats`,
    headers: storage ? getAuth() : null,
  });
};

// ==== запрос на билет ==== //
export const toBookTicket = (body) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/order/with_payment_params/PORTMONE`,
    headers: storage ? getAuth() : null,
    data: body,
  });
};

// ==== информация о билете ==== //
export const getTicketInfo = (id) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/order/${id}`,
    headers: storage ? getAuth() : null,
  });
};

//  ==== googlePay confirm ==== //
export const isGooglePayComfirm = (body, orderId, paymentParamsId) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/transaction/gPay/${orderId}/${paymentParamsId}`,
    headers: storage ? getAuthWithContentType() : null,

    data: body,
  });
};

// ==== подтвердждение оплаты ==== //
export const ticketComfirm = (orderId, paymentParamsId) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/order/${orderId}/confirm/AQUIRING/${paymentParamsId}`,
    headers: storage ? getAuthWithContentType() : null,
  });
};

// ==== получение билета для печати ==== //
export const getTicketPrint = (id, lang) => {
  return axios({
    method: "get",
    url: `${baseURLsale}/order/${id}/document/${lang}`,
    headers: storage ? getAuth() : null,
  });
};

// ==== поаулярные маршруты ==== //
export const getPopularRouts = () => {
  return axios({
    method: "get",
    url: `${baseURLsale}/search/trips`,
    headers: storage ? getAuth() : null,
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
    url: `${baseURLsale}/additional`,
    headers: storage ? getAuth() : null,
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
    url: `${baseURLsale}/additional/${searchId}`,
    headers: storage ? getAuth() : null,
  });
};

// ==== обновление заказа с дополнительными сервисами ==== //
export const updateTicketWithServices = (orderId, data) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/order/${orderId}/service/add`,
    headers: storage ? getAuth() : null,
    data: data,
  });
};

// ==== отправка номера телефона ==== //
export const sendValidation = (phone) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/client/customer/register`,
    data: {
      login: phone,
      phone: phone,
    },
  });
};

//  ==== подтверждение паролем ==== //
export const confirmValidation = (phone, code) => {
  return axios({
    method: "post",
    url: `${baseURLsale}/client/confirm?clientName=${phone}&validationCode=${code}`,
  });
};

//  ==== получить данніе кошелька пользователя ==== //
export const getWallet = () => {
  return axios({
    method: "get",
    url: `${baseURLsale}/client/wallet`,
    headers: {
      Authorization: AUTH_KEY,
    },
  });
};
