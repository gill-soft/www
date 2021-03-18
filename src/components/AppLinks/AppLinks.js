import React from "react";
import styles from "./AppLinks.module.css";
import play from "../../images/google-play-300x116.png";
import app from "../../images/appstore.png";
import { ReactComponent as Close } from "../../images/clear-black-36dp.svg";

const AppLinks = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.progress2}>
          <div className={styles.progress}></div>
      </div>
      <button className={styles.btn} onClick={() => onClose()}>
        <Close fill="var(--color-secondary)" />
      </button>
      <p className={styles.text}>
        Для більш зручного користування рекомендуємо вам скористатися нашими мобільними
        додатками
      </p>
      <div className={styles.img}>
        <a href="https://play.google.com/store/movies/details/%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9%D0%BA%D0%B0_%D0%9A%D1%80%D1%83%D0%B4%D1%81_%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B5%D0%BB%D1%8C%D0%B5?id=O-BG17Yow6s.P">
          <img src={play} alt="playMarket"></img>
        </a>
      </div>
      <div className={styles.img}>
        <img src={app} alt="appStore"></img>
      </div>
    </div>
  );
};

export default AppLinks;
