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
  return lng
};
