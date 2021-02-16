export const getLang = (lang) => {
  let lng;
  switch (lang) {
    case "RU":
      lng = "ru";
      break;
    case "UA":
      lng = "uk";
      break;
    case "EN":
      lng = "en";
      break;
    case "PL":
      lng = "pl";
      break;
    default:
      break;
  }
  return lng;
};
// ==== получаем наcелённый пункт отправки/прибытия ==== //
export const getLocality = (id, stops, lang) => {
  const result = stops.find((el) => el.id === id);
  // console.log(id)
  return result ? result.name[`${lang}`] || result.name[`EN`] : null
};

// ==== получаем остановку отправки/прибытия === //
export const getStop = (key, trips, lang) => Object.keys(trips).length >0? trips.localities[`${key}`].name[`${lang}`] : null;

// ==== получаем промежуточную остановку ==== //
export const getAllLocalities = (key, trips, lang) => {
  return (
    Object.keys(trips).length >0 ?trips.localities[`${key}`].name[`${lang}`] || trips.localities[`${key}`].name[`RU`] : null
  );
};

// ==== получаем дату отправки/прибытия ==== //
export const getDate = (key, trip, lang) => {
  return new Date(trip[`${key}`]).toLocaleString(getLang(lang), {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

// ==== получаем время отправки/прибытия ==== //
export const getTime = (key, trip, lang) => {
  return new Date(trip[`${key}`]).toLocaleString(getLang(lang), {
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
export const getYesterday = ({ date }, lang) => {
  return new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).toLocaleString(
    getLang(lang),
    {
      day: "2-digit",
      month: "long",
      year: "2-digit",
    }
  );
};
export const getTomorrow = ({ date }, lang) => {
  return new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toLocaleString(
    getLang(lang),
    {
      day: "2-digit",
      month: "long",
      year: "2-digit",
    }
  );
};
export const getTodayDate = ({ date }, lang) => {
  return new Date(date).toLocaleString(getLang(lang), {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
};

export const getExpireTime = (date, lang) => {
  return new Date(date).toLocaleString(getLang(lang), {
    day: "2-digit",
    month: "long",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
