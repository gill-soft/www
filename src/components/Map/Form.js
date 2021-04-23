import React from "react";
import { Link } from "react-router-dom";
import styles from "./Leaflet.module.css";

const Form = ({ from , to}) => {
  return (
    <div className={styles.formBox}>

      <div className={styles.inpupsBox}>
        <div className={styles.input}>
          <p>Звідки</p>
          <p>{from?.name?.EN}</p>
        </div>
        <div className={styles.input}>
          <p>Куди</p>
          <p>{to?.name?.EN}</p>
        </div>
      </div>
      <Link to="#">dsgfds</Link>
    </div>
  );
};

export default Form;
