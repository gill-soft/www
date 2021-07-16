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
// import app from "../../images/appstore.png";
import { getUrl } from "../../services/getUrl";
import { getError } from "../../redux/global/globalActions";
import AuthorizationHeader from "../AuthorizationContainer/AuthorizationHeader";

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
                <a href="viber://pa?chatURI=busis">Viber bot</a>
              </div>
            </CSSTransition>
          )}
        </div>
        <AuthorizationHeader />

        {windowWidth < 768 && (
          <>
            <div className={styles.contactsBox}>
              <p className={styles.tel}>
                <FormattedMessage id="mobile" />
              </p>
              <div className={styles.mobile}>
                <a href="https://play.google.com/store/apps/details?id=com.veze.gds">
                  <img src={play} alt="playMarket"></img>
                </a>
                {/* <img src={app} alt="appStore"></img> */}
              </div>
            </div>
          </>
        )}
      </nav>
      <LanguageSelect />
    </IntlProvider>
  );
};

export default Nav;
