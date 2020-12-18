export const changeLanguage = () => {
  const select = document.querySelector('#lenguage');
  let lang = 'RU';
  const change = () => {
    return localStorage.setItem('language', JSON.stringify(select.value));
  };
  localStorage.setItem('language', JSON.stringify(lang));
  select.addEventListener('change', change);
};
