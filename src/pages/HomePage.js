import React from "react";
import styles from "./HomePage.module.css";

import SearchForm from "../components/SearchForm/SearchForm";

const HomePage = ({ history, fetchStops }) => {
  return (
    <>
      <div className={styles.bgnd}>
        <div className={styles.container}>
          <h1 className={styles.title}> Билеты на автобус</h1>
          <p className={styles.subtitle}>по Украине, Польше, Европе</p>
          <div className={styles.formContainer}>
            <SearchForm history={history} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
