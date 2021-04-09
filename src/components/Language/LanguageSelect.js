import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../redux/Language/LanguageAction";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import styles from "./LanguageSelect.module.css";

const LanguageSelect = () => {
  const language = useSelector((state) => state.language);
  const from = useSelector((state) => state.searchForm.from);
  const to = useSelector((state) => state.searchForm.to);
  const stops = useSelector((state) => state.global.stops);
  const dispatch = useDispatch();
  const changeInputFrom = (value) => dispatch(inputValueFrom(value));
  const changeInputTo = (value) => dispatch(inputValueTo(value));
  const onChangeLanguage = (value) => dispatch(changeLanguage(value));

  const handleChange = ({ target }) => {
    const fromObj = stops.find((el) => el.id === from.value);
    const toObj = stops.find((el) => el.id === to.value);
    console.log("2", fromObj.name[target.value]);
    changeInputFrom({
      text: fromObj.name[target.value] || fromObj.name["EN"],
      value: fromObj.id,
    });
    changeInputTo({
      text: toObj.name[target.value] || toObj.name["EN"],
      value: toObj.id,
    });
    onChangeLanguage(target.value);
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
