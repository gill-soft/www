import React from "react";
import styles from "./FormForBuy.module.css";

const TextInput = ({
  id,
  idx,
  name,
  values,
  isValidName,
  handleChangeInput,
  label,
  onlyLatin,
}) => {
  return (
    <div className={styles.inputBox}>
    
      <label className={styles.label} htmlFor="surname">
        {label}<small>{onlyLatin()}</small>
      </label>
      <input
        className={`${styles.input} ${isValidName[0] === idx ? styles.red : null}`}
        name={name}
        type="text"
        value={values[idx][name]}
        onChange={(e) => handleChangeInput(id, e)}
        autoComplete="nope"
      />
      {isValidName[0] === idx && <p className={styles.redText}>{isValidName[1]}</p>}
    </div>
  );
};

export default TextInput;
