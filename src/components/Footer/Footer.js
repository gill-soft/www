import React from "react";
import Offerta from "../../assets/Oferta_VZ.pdf";
import Pk from "../../assets/pk_VZ.pdf";
import styles from "./Footer.module.css";
import play from "../../images/google-play-300x116.png";
import app from "../../images/appstore.png";
import visa from "../../images/visa-min.png";
import vuso from "../../images/vuso-min.png";
import mastercard from "../../images/Mastercard-min.png";
import maestro from "../../images/maestro-min.png";
const Fotter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.imagesBox}>
          <img
            className={styles.logoImg}
            width="70px"
            height="41px"
            src={vuso}
            alt="Vuso logo"
          ></img>
          <img
            className={styles.logoImg}
            width="70px"
            height="41px"
            src={mastercard}
            alt="Mastercsrd logo"
          ></img>
          <img
            className={styles.logoImg}
            width="70px"
            height="41px"
            src={maestro}
            alt="Maestro logo"
          ></img>
          <img
            className={styles.logoImg}
            width="70px"
            height="41px"
            src={visa}
            alt="Visa logo"
          ></img>
        </div>
        <div className={styles.row}>
          <div className={styles.listBox}>
            <h4 className={styles.title}>Контакти</h4>
            <ul>
              <li className={styles.listItem}>
                <a className={styles.link} href="tel: +1 111 111-11-11">
                  Зв'язок з оператором:
                  <br /> +38 (099) 999-99-99
                </a>
              </li>
              <li>
                <a className={styles.link} href="mailto: test@test.com">
                  Email: test@test.com
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.listBox}>
            <h4 className={styles.title}>Документи</h4>
            <ul>
              <li className={styles.listItem}>
                <a className={styles.link} href={Offerta} target="_blanc">
                  Договір оферти
                </a>
              </li>
              <li>
                <a className={styles.link} href={Pk} target="_blanc">
                  Політика конфіденційності
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.listBox}>
            <h4 className={styles.title}>Мобільні додатки</h4>
            <div className={styles.flexImgs}>
              <div className={styles.img}>
                <a href="https://play.google.com/store/movies/details/%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9%D0%BA%D0%B0_%D0%9A%D1%80%D1%83%D0%B4%D1%81_%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B5%D0%BB%D1%8C%D0%B5?id=O-BG17Yow6s.P">
                  <img src={play} width="150px" height="44px" alt="playMarket"></img>
                </a>
              </div>
              <div className={styles.img}>
                <img src={app} width="150px" height="44px" alt="appStore"></img>
              </div>
            </div>
          </div>
        </div>

        <p>
          &copy; {new Date().getFullYear()}, Veze.
          <span> Всі права захищено. Онлайн сервіс продажу квитків</span>
        </p>
      </div>
    </footer>
  );
};

export default Fotter;
