import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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

  const windowWidth = window.innerWidth;
  const backdropRef = useRef(null);

  const handleBackdropClick = (event) => {
    const { current } = backdropRef;
    if (current && event.target !== current) return;
    setIsMenu(false);
  };
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
            {/* {isMenu && ( */}
            <CSSTransition in={isMenu} timeout={300} classNames="alert" unmountOnExit nodeRef={backdropRef}>
              <div
                className={styles.backdrop}
                ref={backdropRef}
                onClick={handleBackdropClick}
              >
                <div className={styles.menuBox}>
                  <p className={styles.telS}>
                    Связь c оператором:{" "}
                    <a href="tel: +1 111 111-11-11">+1 111 111-11-11</a>
                  </p>
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
            {/* )} */}
          </>
        ) : (
          <>
            <p className={styles.tel}>
              Связь c оператором: <a href="tel: +1 111 111-11-11">+1 111 111-11-11</a>
            </p>
            <LanguageSelect />
          </>
        )}

        {/* <MyTicket /> */}
      </div>
    </header>
  );
};

export default Header;
