// import { getTime } from "date-fns";

// ==== получаем наcелённый пункт отправки/прибытия ==== //
export const getLocality = (id, stops, lang) => {
  const result = stops.find((el) => el.id === id);
  return result ? result.name[lang] || result.name[`EN`] : null;
};
// ==== получаем город отправки/прибытия
export const getCity = (id, trips, lang) => {
  const parentId = trips.localities[id].parent.id;
  const city = trips.localities[parentId] ? trips.localities[parentId].name : "";
  return city ? city[lang] || city.EN || city.UA || city.RU || city.PL : "";
};

// ==== получаем остановку отправки/прибытия === //
export const getStop = (id, trips, lang) => {
  const stop = trips.localities[id].name ? trips.localities[id].name : "";
  return stop ? stop[lang] || stop.EN || stop.UA || stop.RU || stop.PL : "";
};

// ==== получаем adress отправки/прибытия === //
export const getAddress = (id, trips, lang) => {
  const address = trips.localities[id].address ? trips.localities[id].address : "";
  return address
    ? address[lang] || address.EN || address.UA || address.RU || address.PL
    : "";
};
export const getRouteName = (id, trips) => {
  const routeName = trips.segments[id].route ? trips.segments[id].route.name : "";
  return routeName ? routeName.EN || routeName.UA || routeName.RU || routeName.PL : "";
};
// ==== получаем адресс промежуточной остановки ==== //
export const getAllAddress = (key, trips, lang) =>
  Object.keys(trips).length > 0 && trips.localities[key]?.address
    ? trips.localities[key]?.address[lang] || trips.localities[key].address[`RU`]
    : null;

// ==== получаем дату отправки/прибытия ==== //
export const getDate = (key, trip, lang) => {
  const date = trip[key].split(" ")[0];
  return new Date(new Date(date).getTime()).toLocaleString(lang, {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

// ==== получаем время отправки/прибытия ==== //
export const getTimeDisplay = (key, trip, lang) => {
  return trip[key].split(" ")[1];
};

// ==== получаем время в дороге маршрутов с пересадкой ====//
export const getTimeInWayDouble = (tripKeys, trips, lang) => {
  let h, m;
  switch (lang) {
    case "RU":
      h = "ч";
      m = "мин";
      break;
    case "UA":
      h = "г";
      m = "хв";
      break;
    case "EN":
      h = "h";
      m = "min";
      break;
    case "PL":
      h = "g";
      m = "min";
      break;
    default:
      break;
  }
  const dateDeparture = trips.segments[tripKeys[0]].departureDate.split(" ");
  const dateArrival = trips.segments[tripKeys[0]].arrivalDate.split(" ");
  const departureTime =
    dateDeparture[1].split(":")[0] * 60 * 60 * 1000 +
    dateDeparture[1].split(":")[1] * 60 * 1000;
  const arrivalTime =
    dateArrival[1].split(":")[0] * 60 * 60 * 1000 +
    dateArrival[1].split(":")[1] * 60 * 1000;
  const departureMs = new Date(dateDeparture[0]).getTime() + departureTime;
  const arrivalMs = new Date(dateArrival[0]).getTime() + arrivalTime;
  const deltaMs = arrivalMs - departureMs;
  const hour = Math.floor(deltaMs / (1000 * 60 * 60));
  const minutes = Math.floor((deltaMs / (1000 * 60)) % 60);

  return `${hour}${h} ${minutes}${m}`;
};

// ==== получаем сумму рейсов с пересадкой ====//
export const getPrice = (tripKeys, trips) => {
  return tripKeys.reduce((summ, el) => {
    summ += Number(trips.segments[el].price.amount);
    return summ;
  }, 0);
};
// ==== вчерашняя дата ==== //
export const getYesterday = ({ date }, lang) => {
  return new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).toLocaleString(lang, {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
};

// ==== завтрашняя дата ==== //
export const getTomorrow = ({ date }, lang) => {
  return new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toLocaleString(lang, {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
};

// ==== сегодняшняя дата ==== //
export const getTodayDate = ({ date }, lang) => {
  return new Date(date).toLocaleString(lang, {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
};
// ==== время до конца оплаты ==== //
export const getExpireDate = (date, lang) => {
  const time = date.split(" ")[0];
  return new Date(time).toLocaleString(lang, {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
};
export const getExpireTime = (date) => {
  return ` ${date.split(" ")[1]}`;
  
};
