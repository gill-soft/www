export const getLocality = (id, stops, lang) => {
  const res = stops.find((el) => el.id === id);
  return res.name[`${lang}`];
};