import React from "react";
import { Link } from "react-router-dom";
import LanguageSelect from "../Language/LanguageSelect";

import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
          <Link to="/" className={styles.link}></Link>
        <p className={styles.tel}>
          Связь c оператором: <a href="tel: +1 111 111-11-11">+1 111 111-11-11</a>
        </p>
        {/* <MyTicket /> */}
        <LanguageSelect />
      </div>
    </header>
  );
};

export default Header;
