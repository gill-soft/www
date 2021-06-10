import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import LanguageSelect from "../Language/LanguageSelect";
import styles from "./Nav.module.css";
import "../../stylesheet/animation.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messanges } from "../../intl/NavMessanges";
import play from "../../images/google-play-300x116.png";
import app from "../../images/appstore.png";
import { getUrl } from "../../services/getUrl";
import { getError } from "../../redux/global/globalActions";

const Nav = ({ handleClick }) => {
  const windowWidth = window.innerWidth;
  const [isPhone, setIsPhone] = useState(false);
  const phoneRef = useRef(null);
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const clearError = (val) => dispatch(getError(val));
  const locale = lang === "UA" ? "UK" : lang;

  useEffect(() => {
    window.addEventListener("click", () => {
      setIsPhone(false);
    });
  });
  const closeMenu = () => {
    handleClick();
    clearError("");
  };

  return (
    <IntlProvider locale={locale} messages={messanges[locale]}>
      <nav className={styles.nav}>
        <NavLink
          className={styles.navLink}
          activeClassName={styles.selected}
          to="/"
          exact
          onClick={closeMenu}
        >
          <FormattedMessage id="main" />
        </NavLink>
        <NavLink
          className={styles.navLink}
          activeClassName={styles.selected}
          to={`/${getUrl(lang)}`}
          onClick={closeMenu}
        >
          <FormattedMessage id="routs" />
        </NavLink>
        <NavLink
          className={styles.navLink}
          activeClassName={styles.selected}
          to="/info"
          onClick={closeMenu}
        >
          <FormattedMessage id="info" />
        </NavLink>
        <div className={styles.contactsBox}>
          <p
            className={styles.tel}
            onClick={() => {
              setIsPhone(false);
              setTimeout(() => setIsPhone(true), 300);
            }}
          >
                      <FormattedMessage id="contacts" />

          </p>

          {windowWidth < 768 ? (
            <p>
              <a href="tel: +380675092050">+38 (067) 509-20-50</a>
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
                <a href="tel: +380675092050">+38 (067) 509-20-50</a>
                <a href="viber://chat?number=111 111-11-11">viber bot</a>
              </div>
            </CSSTransition>
          )}
        </div>
        <div className={styles.contactsBox}>
          {windowWidth < 768 && (
            <>
              <p className={styles.tel}>Мобільна версія</p>
              <div className={styles.mobile}>
                <a href="https://play.google.com/store/movies/details/%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9%D0%BA%D0%B0_%D0%9A%D1%80%D1%83%D0%B4%D1%81_%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B5%D0%BB%D1%8C%D0%B5?id=O-BG17Yow6s.P">
                  <img src={play} alt="playMarket"></img>
                </a>
                <img src={app} alt="appStore"></img>
              </div>
            </>
          )}
        </div>
      </nav>
      <LanguageSelect />
    </IntlProvider>
  );
};

export default Nav;
