import React from "react";
import styles from "./GenderInput.module.css";

const GenderInput = ({ id, value, changeGender }) => {
  return (
    <div className={styles.genderBox}>
      <p>Стать: </p>
      <div className={styles.checkboxBox}>
        <label>
          <input
            className={styles.checkbox}
            type="checkbox"
            name="gender"
            value="m"
            checked={value === "m"}
            onChange={(e) => changeGender(id, e)}
          />
          чоловік
        </label>
        <label>
          <input
            className={styles.checkbox}
            type="checkbox"
            name="gender"
            value="f"
            checked={value === "f"}
            onChange={(e) => changeGender(id, e)}
          />
          жінка
        </label>
      </div>
    </div>
  );
};

export default GenderInput;
