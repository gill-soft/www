import React from "react";
import styles from "./NoTrips.module.css";
import { ReactComponent as SearchOff } from "../../images/search_off-black-48dp.svg";

const NoTrips = () => {
  return (
    <div className={styles.box}>
      <div className={styles.svg}>
        <SearchOff fill="var(--color-main" />
      </div>
      <h2 className={styles.title}>Маршрутів не знайдено</h2>
      <p>Ми робимо все можливе, щоб підключати якомога більше маршрутів</p>
    </div>
  );
};

export default NoTrips;
