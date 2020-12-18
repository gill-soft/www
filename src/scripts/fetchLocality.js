const listLocality = document.querySelector('.listLocality');
const inputSearchFrom = document.querySelector('#inputSearchFrom');
const inputSearchWhereTo = document.querySelector('#inputSearchWhereTo');
let inputSearchFromValue, inputSearchWhereToValue;

// управление кликом на input
export const handleInputClick = ({ target }) => {
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

// управление нажатием клавиш на input
export const handlePresKey = ({ target }) => {
  if (target.name === 'from') {
    inputSearchFromValue = target.value;
    filterLocality(inputSearchFromValue);
  }
  if (target.name === 'whereTo') {
    inputSearchWhereToValue = target.value;
    filterLocality(inputSearchWhereToValue);
  }
};

//   получить список населенных пунктов
const getListLocality = data => {
  listLocality.innerHTML = '';
  let lang = JSON.parse(localStorage.getItem('language'));
  return data.forEach(el => {
    if (el.type === 'LOCALITY') {
      return (listLocality.innerHTML += `<li ><span class="localityName">${
        el.name[`${lang}`]
      }</span>-<span>${getParent(el, el.parent.id)}</span>
        </li>`);
    }
  });
};

// добавить полный одрес населенных пунктов
const getParent = (obj, id) => {
  let lang = JSON.parse(localStorage.getItem('language'));

  if (!obj.parent.id) return;
  const data = JSON.parse(localStorage.getItem('locality'));
  const [result] = data.filter(el => el.id === id);

  if (!result.parent) {
    return result.name[`${lang}`];
  } else {
    return result.name[`${lang}`] + '/' + getParent(result, result.parent.id);
  }
};

//  фильтр по введеным символам из всего списка
const filterLocality = value => {
  const data = JSON.parse(localStorage.getItem('locality'));
  let lang = JSON.parse(localStorage.getItem('language'));

  const newData = data.filter(item => {
    if (item.type === 'LOCALITY') {
      return (
        item.name[`${lang}`].toLowerCase().indexOf(value.trim().toLowerCase()) > -1
      );
    }
  });
  getListLocality(newData);
};

//   выбор населенного пункта по клику из списка
export const chooseLocality = ({ target }) => {
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
export const changeFromWhere = () => {
  const from = inputSearchFrom.value;
  const whereTo = inputSearchWhereTo.value;

  inputSearchFrom.value = whereTo;
  inputSearchWhereTo.value = from;
};
