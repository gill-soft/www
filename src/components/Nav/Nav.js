import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import LanguageSelect from "../Language/LanguageSelect";
import styles from "./Nav.module.css";
import "./anime.css";

import play from "../../images/google-play-300x116.png";
import app from "../../images/appstore.png";

const Nav = () => {
  const windowWidth = window.innerWidth;
  const [isPhone, setIsPhone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const phoneRef = useRef(null);
  const mobileRef = useRef(null);

  useEffect(() => {
    window.addEventListener("click", () => {
      setIsPhone(false);
      setIsMobile(false);
    });
  });

  return (
    <>
      <nav className={styles.nav}>
        <NavLink
          className={styles.navLink}
          activeClassName={styles.selected}
          to="/"
          exact
        >
          Головна
        </NavLink>
        <NavLink className={styles.navLink} activeClassName={styles.selected} to="/міста">
          Маршрути
        </NavLink>
        <NavLink className={styles.navLink} activeClassName={styles.selected} to="/info">
          Інформація
        </NavLink>
        <div className={styles.contactsBox}>
          <p
            className={styles.tel}
            onClick={() => {
              setIsPhone(false);
              setTimeout(() => setIsPhone(true), 300);
            }}
          >Контакти
          </p>

          {windowWidth < 768 ? (
            <p>
              <a href="tel: +1 111 111-11-11">+38 (099) 999-99-99</a>
            </p>
          ) : (
            <CSSTransition
              in={isPhone}
              timeout={300}
              classNames="phone"
              unmountOnExit
              nodeRef={phoneRef}
            >
              <div className={styles.contacts} ref={phoneRef}>
                <a href="tel: +1 111 111-11-11">+38 (099) 999-99-99</a><br/>
                <a href="viber://chat?number=111 111-11-11">viber bot</a>
              </div>
            </CSSTransition>
          )}
        </div>
        <div className={styles.contactsBox}>
          <p
            className={styles.tel}
            onClick={() => {
              setIsMobile(false);
              setTimeout(() => setIsMobile(true), 300);
            }}
          >
            Мобільна версія
          </p>

          {windowWidth < 768 ? (
            <div className={styles.mobile}>
              <a href="https://play.google.com/store/movies/details/%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9%D0%BA%D0%B0_%D0%9A%D1%80%D1%83%D0%B4%D1%81_%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B5%D0%BB%D1%8C%D0%B5?id=O-BG17Yow6s.P">
                <img src={play} alt="playMarket"></img>
              </a>
              <img src={app} alt="appStore"></img>
            </div>
          ) : (
            <CSSTransition
              in={isMobile}
              timeout={300}
              classNames="mobile"
              unmountOnExit
              nodeRef={mobileRef}
            >
              <div className={styles.mobile} ref={mobileRef}>
                <a href="https://play.google.com/store/movies/details/%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9%D0%BA%D0%B0_%D0%9A%D1%80%D1%83%D0%B4%D1%81_%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B5%D0%BB%D1%8C%D0%B5?id=O-BG17Yow6s.P">
                  <img src={play} alt="playMarket"></img>
                </a>
                <img src={app} alt="appStore"></img>
              </div>
            </CSSTransition>
          )}
        </div>
      </nav>
      <LanguageSelect />
    </>
  );
};

export default Nav;
