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
  return new Date(trip[key]).toLocaleString(lang, {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

// ==== получаем время отправки/прибытия ==== //
export const getTime = (key, trip, lang) => {
  return new Date(trip[key]).toLocaleString(lang, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ==== получаем время в дороге маршрута ==== //
export const getTimeInWay = (trip, lang) => {
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
  return `${+trip.timeInWay.split(":")[0]}${h} ${trip.timeInWay.split(":")[1]}${m}`;
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
  const departureMs = new Date(trips.segments[tripKeys[0]].departureDate).getTime();
  const arrivalMs = new Date(
    trips.segments[tripKeys[tripKeys.length - 1]].arrivalDate
  ).getTime();
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
export const getExpireTime = (date, lang) => {
  return new Date(date).toLocaleString(lang, {
    day: "2-digit",
    month: "long",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
