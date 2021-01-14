export const getLocality = (stops, id) => {
    const result = stops.find((el) => el.id === id);
    return result.name["RU"];
  };