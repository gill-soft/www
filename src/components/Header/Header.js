import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import styles from "./Header.module.css";
import { ReactComponent as Menu } from "../../images/menu-black-48dp.svg";
import { ReactComponent as Close } from "../../images/clear-black-36dp.svg";
import { getError } from "../../redux/global/globalActions";
import Nav from "../Nav/Nav";
import "../../stylesheet/animation.css";
import Agent from "../Agent/Agent";

const Header = () => {
  const dispatch = useDispatch();
  const clearErorr = (val) => dispatch(getError(val));
  const [isMenu, setIsMenu] = useState(false);
  const [agent, setAgent] = useState(null);
  const windowWidth = window.innerWidth;
  const backdropRef = useRef(null);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("auth"));
    setAgent(storage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("auth")]);

  const handleBackdropClick = (event) => {
    const { current } = backdropRef;
    if (current && event.target !== current) return;
    setIsMenu(false);
  };
  const handleClick = () => {
    setIsMenu(false);
  };
  const handleExit = () => {
    setAgent(null);
    localStorage.removeItem("auth");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={() => clearErorr("")}></Link>

        {windowWidth < 768 ? (
          <>
            {agent && (
              <Agent agent={agent} handleExit={handleExit}/>
            )}
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
              classNames="menu"
              unmountOnExit
              nodeRef={backdropRef}
            >
              <div
                className={styles.backdrop}
                ref={backdropRef}
                onClick={handleBackdropClick}
              >
                <div className={styles.menuBox}>
                  <Nav handleClick={handleClick} />
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
          <Nav handleClick={handleClick} agent={agent} handleExit={handleExit} />
        )}
      </div>
    </header>
  );
};

export default Header;
