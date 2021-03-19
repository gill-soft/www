import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import LanguageSelect from "../Language/LanguageSelect";
import styles from "./Nav.module.css";
import "./anime.css";

const Nav = () => {
  const windowWidth = window.innerWidth;
  const [isPhone, setIsPhone] = useState(false);
  const phoneRef = useRef(null);
  useEffect(() => {
    window.addEventListener("click", () => {
      setIsPhone(false);
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
        <NavLink
          className={styles.navLink}
          activeClassName={styles.selected}
          to="/about-us"
        >
          Про нас
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
          >
            Контакти
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
                <a href="tel: +1 111 111-11-11">+38 (099) 999-99-99</a>
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
