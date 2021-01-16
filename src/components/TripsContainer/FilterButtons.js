import React from "react";
import styles from "./FilterButtons.module.css";

const FilterButtons = ({
  sortTimeInWay,
  sortDepartureTime,
  sortArrivalTime,
  sortPrice,
}) => {
  return (
    <div className={styles.filterButtons}>
      <button type="button" onClick={() => sortDepartureTime()}>
        Время отправления
      </button>
      <button type="button" onClick={() => sortTimeInWay()}>
        Время в пути
      </button>
      <button type="button" onClick={() => sortArrivalTime()}>
        Время прибытия
      </button>
      <button type="button" onClick={() => sortPrice()}>
        Стоимость
      </button>
    </div>
  );
};

export default FilterButtons;
