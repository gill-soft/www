import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Menu } from "../../images/menu-black-48dp.svg";
import LanguageSelect from "../Language/LanguageSelect";

import styles from "./Header.module.css";

const Header = () => {
  const [isMenu, setIsMenu] = useState(false);
  const windowWidth = window.innerWidth;
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.link}></Link>
        {windowWidth < 768 ? (
          <button
            className={styles.btnMenu}
            type="button"
            onClick={() => setIsMenu(!isMenu)}
          >
            <Menu />
          </button>
        ) : (
          <p className={styles.tel}>
            Связь c оператором: <a href="tel: +1 111 111-11-11">+1 111 111-11-11</a>
          </p>
        )}
        {isMenu && (
          <div className={styles.menuBox}>
            <p >
            Связь c оператором: <a href="tel: +1 111 111-11-11">+1 111 111-11-11</a>
          </p>
            <button type="button" onClick={() => setIsMenu(!isMenu)}>
              close
            </button>
          </div>
        )}
        {/* <MyTicket /> */}
        <LanguageSelect />
      </div>
    </header>
  );
};

export default Header;
