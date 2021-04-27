import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import styles from "./Header.module.css";
import { ReactComponent as Menu } from "../../images/menu-black-48dp.svg";
import { ReactComponent as Close } from "../../images/clear-black-36dp.svg";
import { getError } from "../../redux/global/globalActions";
import Nav from "../Nav/Nav";
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
  const handleClick =()=> {
    setIsMenu(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={() => clearErorr("")}></Link>
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
                  <Nav handleClick={handleClick}/>
                  <button
                    className={styles.btnClose}
                    type="button"
                    onClick={() => setIsMenu(!isMenu)}
                  >
                    <Close />
                  </button>
                </div>
              </div>
            </CSSTransition>
          </>
        ) : (
          <Nav handleClick={handleClick} />
        )}
      </div>
    </header>
  );
};

export default Header;
