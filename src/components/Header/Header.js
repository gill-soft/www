import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import styles from "./Header.module.css";
import { ReactComponent as Menu } from "../../images/menu-black-48dp.svg";
import { ReactComponent as Remove } from "../../images/clear-black-36dp.svg";
import { getError } from "../../redux/global/globalActions";
import LanguageSelect from "../Language/LanguageSelect";
import "./anime.css";

const Header = () => {
  const dispatch = useDispatch();
  const clearErorr = (val) => dispatch(getError(val));
  const [isMenu, setIsMenu] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  const windowWidth = window.innerWidth;
  const backdropRef = useRef(null);
  const phoneRef = useRef(null);

  const handleBackdropClick = (event) => {
    const { current } = backdropRef;
    if (current && event.target !== current) return;
    setIsMenu(false);
  };
  useEffect(() => {
    window.addEventListener("click", () => {
      setIsPhone(false);
    });
  });

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.link} onClick={() => clearErorr("")}></Link>
        {windowWidth < 768 ? (
          <>
            <button
              className={styles.btnMenu}
              type="button"
              onClick={() => setIsMenu(!isMenu)}
            >
              <Menu />
            </button>
            <CSSTransition
              in={isMenu}
              timeout={300}
              classNames="alert"
              unmountOnExit
              nodeRef={backdropRef}
            >
              <div
                className={styles.backdrop}
                ref={backdropRef}
                onClick={handleBackdropClick}
              >
                <div className={styles.menuBox}>
                  <nav className={styles.nav}>
                    <NavLink
                      className={styles.navLink}
                      activeClassName={styles.selected}
                      to="/"
                      exact
                      onClick={() => setIsMenu(false)}
                    >
                      Головна
                    </NavLink>
                    <NavLink
                      className={styles.navLink}
                      activeClassName={styles.selected}
                      to="/about-us"
                      onClick={() => setIsMenu(false)}
                    >
                      Про нас
                    </NavLink>
                    <NavLink
                      className={styles.navLink}
                      activeClassName={styles.selected}
                      to="/info"
                      onClick={() => setIsMenu(false)}
                    >
                      Інформація
                    </NavLink>
                    <div className={styles.contactsBox}>
                      <p className={styles.tel} onClick={() => setIsPhone(true)}>
                        Контакти
                      </p>
                      <a href="tel: +38 (099) 999-99-99" onClick={() => setIsMenu(false)}>
                        +38 (099) 999-99-99
                      </a>
                    </div>
                  </nav>

                  <button
                    className={styles.btn}
                    type="button"
                    onClick={() => setIsMenu(!isMenu)}
                  >
                    <Remove />
                  </button>
                  <LanguageSelect />
                </div>
              </div>
            </CSSTransition>
          </>
        ) : (
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
              <NavLink
                className={styles.navLink}
                activeClassName={styles.selected}
                to="/info"
              >
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
              </div>
            </nav>

            <LanguageSelect />
          </>
        )}

        {/* <MyTicket /> */}
      </div>
    </header>
  );
};

export default Header;
