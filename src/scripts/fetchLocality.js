export const fetchListLocality = () => {
  const listLocality = document.querySelector('.listLocality');
  const localityName = document.querySelector('.localityName');
  const inputSearchFrom = document.querySelector('#inputSearchFrom');
  const inputSearchWhereTo = document.querySelector('#inputSearchWhereTo')
  let inputSearchFromValue, inputSearchWhereToValue;

  const getListLocality = data => {
    listLocality.innerHTML = '';
    return data.forEach(el => {
      if (el.type === 'LOCALITY') {
        return (listLocality.innerHTML += `<li><span class="localityName">${
          el.name.RU
        }</span>-<span>${getParent(el, el.parent.id)}</span>
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

  //   const haldleClick = () => {
  //     const data = JSON.parse(localStorage.getItem('locality'));
  //     getListLocality(data);
  //   };

  const haldlePresKey = ({ target }) => {
    if (target.name === 'from') {
      inputSearchFromValue = target.value;
      filterLocality(inputSearchFromValue);
    }
    if (target.name === 'whereTo') {
        inputSearchWhereToValue = target.value;
        filterLocality(inputSearchWhereToValue);
      }
  };

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

  const chooseLocality = ({target}) => {
      const value = target.parentElement.firstChild.textContent
      inputSearchFrom.value = value
      console.log(value)
  }


  inputSearchFrom.addEventListener('keyup', haldlePresKey);
  inputSearchWhereTo.addEventListener('keyup', haldlePresKey)
  //   inputSearch.addEventListener('click', haldleClick);

  listLocality.addEventListener('click', chooseLocality)
};
