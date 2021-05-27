import React from "react";
import styles from "./FormForBuy.module.css";

const TextInput = ({
  id,
  idx,
  name,
  values,
  isValid ,
  handleChangeInput,
  label,
}) => {
  return (
    <div className={styles.inputBox}>
      <label className={styles.label} htmlFor={name}>
        {label}
        
      </label>
      <input
        className={`${styles.input} ${isValid[idx]?.[name] ? styles.red : null}`}
        name={name}
        type="text"
        value={values[idx][name]}
        onChange={(e) => handleChangeInput(id, e)}
        autoComplete="nope"
      />
      {isValid[idx]?.[name] && <p className={styles.redText}>{isValid[idx]?.[name]}</p>}
    </div>
  );
};

export default TextInput;
