import React from "react";

const GenderInput = ({ id, value, changeGender }) => {
  return (
    <>
      <span>Стать: </span>
      <label>
        <input
          type="checkbox"
          name="gender"
          value="m"
          checked={value === "m"}
          onChange={(e) => changeGender(id, e)}
        />{" "}
        чоловік
      </label>
      <label>
        <input
          type="checkbox"
          name="gender"
          value="f"
          checked={value === "f"}
          onChange={(e) => changeGender(id, e)}
        />
        жінка
      </label>
    </>
  );
};

export default GenderInput;
