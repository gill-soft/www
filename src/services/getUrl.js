export const getUrl = (lang) => {
  if (lang === "UA") return "автобуси";
  if (lang === "RU") return "автобусы";
  if (lang === "EN") return "trips";
  if (lang === "PL") return "autobusy";
};

export const getUrlCities = (lang) => {
  if (lang === "UA") return "міста";
  if (lang === "RU") return "города";
  if (lang === "EN") return "cities";
  if (lang === "PL") return "miasta";
};
