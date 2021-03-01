import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../redux/Language/LanguageAction";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import styles from "./LanguageSelect.module.css";

const LanguageSelect = () => {
  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const changeInputFrom = (value) => dispatch(inputValueFrom(value));
  const changeInputTo = (value) => dispatch(inputValueTo(value));
  const onChangeLanguage = (value) => dispatch(changeLanguage(value));

  const handleChange = ({ target }) => {
    changeInputFrom("");
    changeInputTo("");
    onChangeLanguage(target.value);
  };
  return (
    <div className={styles.selectBox}>
      <select className={styles.select} value={language} onChange={handleChange}>
        <option className={styles.option} value="RU">
          Руский
        </option>
        <option className={styles.option} value="EN">
          English
        </option>
        <option className={styles.option} value="UA">
          Українська
        </option>
        <option className={styles.option} value="PL">
          Polski
        </option>
      </select>
    </div>
  );
};

export default LanguageSelect;
