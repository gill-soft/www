export const fetchListLocality = () => {
  const listLocality = document.querySelector('.listLocality');
  const inputSearchFrom = document.querySelector('#inputSearchFrom');
  const inputSearchWhereTo = document.querySelector('#inputSearchWhereTo');
  const buttonChange = document.querySelector('#buttonChange');

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

  //
  const haldleInputClick = ({ target }) => {
    const data = JSON.parse(localStorage.getItem('locality'));
    listLocality.hidden = false;

    !target.value ? getListLocality(data) : filterLocality(target.value);
    if (target.name === 'from') {
      listLocality.classList.remove('whereTo');
      listLocality.classList.add('from');
    }
    if (target.name === 'whereTo') {
      listLocality.classList.remove('from');
      listLocality.classList.add('whereTo');
    }
  };
  
  //
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
//  фильтр по введеным символам из всего списка
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

//   выбор населенного пункта по клику из списка
  const chooseLocality = ({ target }) => {
    const value = target.parentElement.firstChild.textContent;
    if (listLocality.classList.contains('from')) {
      inputSearchFrom.value = value;
    }
    if (listLocality.classList.contains('whereTo')) {
      inputSearchWhereTo.value = value;
    }
    listLocality.hidden = true;
  };

//   изменение местами отправки и прибытия
  const changeFromWhere = () => {
    const from = inputSearchFrom.value;
    const whereTo = inputSearchWhereTo.value;

    inputSearchFrom.value = whereTo;
    inputSearchWhereTo.value = from;
  };

  inputSearchFrom.addEventListener('keyup', haldlePresKey);
  inputSearchWhereTo.addEventListener('keyup', haldlePresKey);

  inputSearchFrom.addEventListener('click', haldleInputClick);
  inputSearchWhereTo.addEventListener('click', haldleInputClick);

  listLocality.addEventListener('click', chooseLocality);
  buttonChange.addEventListener('click', changeFromWhere);
};
