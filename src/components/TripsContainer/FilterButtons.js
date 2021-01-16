import React from "react";
import styles from "./FilterButtons.module.css";

const FilterButtons = ({
  filterTimeInWay,
  filterDepartureTime,
  filterArrivalTime,
  filterPrice,
}) => {
  //   const handlefilterTimeInWay = () => {
  //     filterTimeInWay();
  //   };
  //   const handlefilterDepartureTime =()=> {
  //     filterDepartureTime()
  //   }

  return (
    <div className={styles.filterButtons}>
      <button type="button" onClick={() => filterDepartureTime()}>
        Время отправления
      </button>
      <button type="button" onClick={() => filterTimeInWay()}>
        Время в пути
      </button>
      <button type="button" onClick={() => filterArrivalTime()}>
        Время прибытия
      </button>
      <button type="button" onClick={() => filterPrice()}>
        Стоимость
      </button>
    </div>
  );
};

export default FilterButtons;
