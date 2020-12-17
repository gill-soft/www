export const fetchLocality = () => {
  const baseUrl = 'https://busis.eu/gds-control/api/v1';
  const localityAll = '/locality/all';
  const listLocality = document.querySelector('.listLocality');
  const localityName = document.querySelector('.localityName');
  //   const inputSearch = document.querySelectorAll('.inputSearch');
  const inputSearch = document.querySelector('#inputSearchFrom');
  //
  const fetchData = async url => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic Y2Fycmllcl90ZXN0OnRlc3RfY2Fycmllcg==',
        },
      });
      const data = await response.json();
      return toLocalStorage(data);
    } catch (error) {
      console.log(error);
    }
  };

  //
  const toLocalStorage = data => {
    localStorage.setItem('locality', JSON.stringify(data));
  };

  //
  const getListLocality = data => {
    listLocality.innerHTML = '';
    return data.forEach(el => {
      if (el.type === 'LOCALITY') {
        return (listLocality.innerHTML += `<li><span class="localityName">${
          el.name.RU
        } -</span><span>${getParent(el, el.parent.id)}</span>
        </li>`);
      }
    });
  };

  //
  const getParent = (obj, id) => {
    if (!obj.parent.id) return;
    const data = JSON.parse(localStorage.getItem('locality'));
    const [result] = data.filter(el => el.id === id);

    if (!result.parent) {
      return result.name.RU;
    } else {
      return result.name.RU + '/' + getParent(result, result.parent.id);
    }
  };

  ///////////////  listener for input //////////////////

  let inputValue;

  const haldleClick = () => {
    const data = JSON.parse(localStorage.getItem('locality'));
    getListLocality(data);
    // fetchData(`${baseUrl}${localityAll}`);
  };
  const haldlePresKey = ({ target }) => {
    inputValue = target.value;
    filterLocality(inputValue);
  };

  //   inputSearch.addEventListener('click', haldleClick);
  inputSearch.addEventListener('keyup', haldlePresKey);

  const filterLocality = value => {
    const data = JSON.parse(localStorage.getItem('locality'));
    const newData = data.filter(item => {
      if (item.type === 'LOCALITY') {
        return (
          item.name.RU.toLowerCase().indexOf(value.trim().toLowerCase()) > -1
        );
      }
    });
    getListLocality(newData);
  };

  fetchData(`${baseUrl}${localityAll}`);
};
