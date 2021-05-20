import React from "react";

const GenderInput = ({ id, values, changeGender }) => {
  return (
    <>
      <span>Стать: </span>
      <label>
        <input
          type="checkbox"
          name="gender"
          value="m"
          checked={values.gender === "m"}
          onChange={(e) => changeGender(id, e)}
        />{" "}
        чоловік
      </label>
      <label>
        <input
          type="checkbox"
          name="gender"
          value="f"
          checked={values.gender === "f"}
          onChange={(e) => changeGender(id, e)}
        />
        жінка
      </label>
    </>
  );
};

export default GenderInput;
