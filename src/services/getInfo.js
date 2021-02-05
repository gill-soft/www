export const getLocality = (id, stops, lang) => {
  const res = stops.find((el) => el.id === id);
  return res.name[`${lang}`];
};
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
