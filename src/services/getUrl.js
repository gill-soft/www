import { getCities } from "./api";

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

export const newUrl =async( params, lang, fromId, toId) => {
  const a = await getCities(params.from, lang)
  const aa = a.data.find(city => city.value=== fromId).text
  const b = await getCities(params.to, lang)
  const bb = b.data.find(city => city.value=== toId).text
  return `/${getUrl(lang)}/${aa}/${bb}`
}
