import React from "react";
import styles from "./HomePage.module.css";
import SearchForm from "../components/SearchForm/SearchForm";

const HomePage = ({ history, fetchStops }) => {
  return (
    <div className={styles.bgnd}>
      <div className={styles.container}>
        <h1 className={styles.title}> Билеты на автобус</h1>
        <p className={styles.subtitle}>по Украине, Польше, Европе</p>
        <div className={styles.formContainer}>
          <SearchForm history={history} />
        </div>
        {/* <ul className={styles.iconsBox}>
          <li className={`${styles.iconItem} ${styles.iconItem1}`}>
            <p>Гарантия низкой цены</p>
          </li>
          <li className={`${styles.iconItem} ${styles.iconItem2}`}>
            <p>Безопасная оплата картой</p>
          </li>
          <li className={`${styles.iconItem} ${styles.iconItem3}`}>
            <p>Круглосуточная служба поддержки</p>
          </li>
          <li className={`${styles.iconItem} ${styles.iconItem4}`}>
            <p>Система скидок и бонусов</p>
          </li>
          <li className={`${styles.iconItem} ${styles.iconItem5}`}>
            <p>Смс информирование</p>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default HomePage;
