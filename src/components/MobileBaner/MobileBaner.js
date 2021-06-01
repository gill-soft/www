import React from "react";
import styles from "./MobileBaner.module.css";
import android from "../../images/google-play-300x116.png";
import ios from "../../images/appstore.png";

const MobileBaner = () => {
  return (
    <div className={styles.bgnd}>
      <div className={`container ${styles.box}`}>
          <div>
        <h2 className={styles.title}>Мобільний дотаток Veze </h2>
        <p className={styles.text}>відчуйте всі переваги нашого сервісу</p></div>
        <div className={styles.imgsBox}>
          <div className={styles.img}>
            <img src={android} width="260px" height="77px" alt="google play" />
          </div>
          <div className={styles.img}>
            <img src={ios} width="360px" height="77px" alt="appstore" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBaner;
