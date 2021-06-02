import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../redux/Language/LanguageAction";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import { getCities } from "../../services/api";
import styles from "./LanguageSelect.module.css";

const LanguageSelect = () => {
  const language = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const dispatch = useDispatch();
  const changeInputFrom = (value) => dispatch(inputValueFrom(value));
  const changeInputTo = (value) => dispatch(inputValueTo(value));
  const onChangeLanguage = (value) => dispatch(changeLanguage(value));

  const handleChange = ({ target }) => {
    if (from.text)
      getCities(from.text, target.value).then(({ data }) => {
        changeInputFrom(
          data.find((city) => city.value === from.value) || { text: "", value: "" }
        );
      });

    if (to.text)
      getCities(to.text, target.value).then(({ data }) => {
        changeInputTo(
          data.find((city) => city.value === to.value) || { text: "", value: "" }
        );
      });
    onChangeLanguage(target.value);
    localStorage.setItem("language", JSON.stringify(target.value));
  };

  return (
    <div className={styles.selectBox}>
      <select className={styles.select} value={language} onChange={handleChange}>
        <option className={styles.option} value="UA">
          UA
        </option>
        <option className={styles.option} value="RU">
          RU
        </option>
        <option className={styles.option} value="EN">
          EN
        </option>
        <option className={styles.option} value="PL">
          PL
        </option>
      </select>
    </div>
  );
};

export default LanguageSelect;
