import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import styles from "./FavoriteTrips.module.css";

const FavoriteTrips = () => {
  return (
    <div className={styles.container}>
      <h2>Найпопулярніші маршрути</h2>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link
            className={styles.link}
            to={`trips?from=2498710&to=2498204&date=${format(
              new Date(),
              "yyyy-MM-dd"
            )}&passengers=1`}
          >
            <span>Київ</span> <span>-</span>
            <span>Харків</span>
            <span>200 грн</span>
          </Link>
        </li>
        <li className={styles.item}>
          <Link
            className={styles.link}
            to={`trips?from=2498389&to=2498710&date=${format(
              new Date(),
              "yyyy-MM-dd"
            )}&passengers=1`}
          >
            <span>Львів</span>
            <span>-</span>
            <span>Київ</span>
            <span>199uah</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FavoriteTrips;
