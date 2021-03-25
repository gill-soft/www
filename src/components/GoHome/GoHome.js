import React from "react";
import { Link } from "react-router-dom";
import styles from './GoHome.module.css'

const GoHome = () => {
  // const handleClick = () => {};
  return (
    <div className={styles.box}>
      <p className={styles.text}>Время для оплаты закончилось</p>
      <Link to="/" className={styles.link}>Перейти на главную страницу</Link>
    </div>
  );
};

export default GoHome;
