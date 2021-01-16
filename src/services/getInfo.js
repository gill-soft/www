export const getLocality = (stops, id) => {
    const result = stops.find((el) => el.id === id);
    // console.log(result.name["RU"])
    return result.name["RU"];
  };