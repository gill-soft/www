'use strict'

const baseUrl = "https://busis.eu/gds-control/api/v1";
const localityAll = "/locality/all";
const listLocality = document.querySelector(".listLocality");
const inputSearch = document.querySelector(".inputSearch")

// 
const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Basic Y2Fycmllcl90ZXN0OnRlc3RfY2Fycmllcg==",
      },
    });
     const data = await response.json();
    return getListLocality(data);
  } catch (error) {
    console.log(error);
  }
};

const getListLocality = (data) => {
  return data.forEach((el) => {
    if (el.type === "LOCALITY") {
      return (listLocality.innerHTML += `<li>${el.name.RU} - ${getParent(
        data,
        el,
        el.parent.id
      )}</li>`);
    }
  });
};

const getParent = (data, obj, id) => {
  if (!obj.parent.id) return;

  const [result] = data.filter((el) => el.id === id);

  if (!result.parent) {
    return result.name.RU;
  } else {
    return result.name.RU + "/" + getParent(data, result, result.parent.id);
  }
};
// console.log(listLocality.value)


//  listener for input //////////////////
const haldleClick = () => {
  fetchData(`${baseUrl}${localityAll}`);
}
 const haldlePresKey = (e) => {
const data = fetchData(`${baseUrl}${localityAll}`)
console.log(data)
 }

// inputSearch.addEventListener('click', haldleClick)
inputSearch.addEventListener('keypress', haldlePresKey)
