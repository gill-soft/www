import React from "react";
import styles from "./SortTrips.module.css";
import { connect } from "react-redux";

const SortTrips = ({ tripsInfo, onChangeValue, value }) => {
  const sortTimeInWay = () => {
    tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`].timeInWay.split(":");
      const time_partsB = b[`${Object.keys(b)}`].timeInWay.split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];
      return A - B;
    });
  };
  const sortTime = (key) => {
    tripsInfo.sort((a, b) => {
      const time_partsA = a[`${Object.keys(a)}`][`${key}`].split(" ")[1].split(":");
      const time_partsB = b[`${Object.keys(b)}`][`${key}`].split(" ")[1].split(":");
      const A = time_partsA[0] + time_partsA[1];
      const B = time_partsB[0] + time_partsB[1];
      return A - B;
    });
  };
  const sortPrice = () => {
    tripsInfo.sort((a, b) => {
      const A = a[`${Object.keys(a)}`].price.amount;
      const B = b[`${Object.keys(b)}`].price.amount;
      return A - B;
    });
  };
  const handleSort = ({ target }) => {
    if (target.value === "departure") sortTime("departureDate");
    if (target.value === "arrival") sortTime("arrivalDate");
    if (target.value === "timeInWay") sortTimeInWay();
    if (target.value === "price") sortPrice();
    onChangeValue(target.value);
  };
  return (
    <div className={styles.selectBox}>
      <label>
        Cортировать по:{" "}
        <select className={styles.select} name="sort" value={value} onChange={handleSort}>
          <option className={styles.option} value="price">
            цене
          </option>
          <option className={styles.option} value="departure">
            времени отправки
          </option>
          <option className={styles.option} value="arrival">
            времени прибытия
          </option>
          <option className={styles.option} value="timeInWay">
            времени в пути
          </option>
        </select>
      </label>
    </div>
  );
};
const mapStateToProps = (state) => ({
  tripsInfo: state.trips.tripsInfo,
});

export default connect(mapStateToProps)(SortTrips);
