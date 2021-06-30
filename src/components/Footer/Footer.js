import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/FooterMessages";
import styles from "./Footer.module.css";
import play from "../../images/google-play-300x116.png";
import app from "../../images/appstore.png";
import visa from "../../images/visa-min.png";
import vuso from "../../images/vuso-min.png";
import mastercard from "../../images/Mastercard-min.png";
import maestro from "../../images/maestro-min.png";
import { getOfferta, getPk } from "../../services/getpdfFiles";

const Fotter = () => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.imagesBox}>
            <img
              className={styles.logoImg}
              width="70px"
              height="41px"
              src={vuso}
              alt="Vuso logo"
            ></img>
            <img
              className={styles.logoImg}
              width="70px"
              height="41px"
              src={mastercard}
              alt="Mastercsrd logo"
            ></img>
            <img
              className={styles.logoImg}
              width="70px"
              height="41px"
              src={maestro}
              alt="Maestro logo"
            ></img>
            <img
              className={styles.logoImg}
              width="70px"
              height="41px"
              src={visa}
              alt="Visa logo"
            ></img>
          </div>
          <div className={styles.row}>
            <div className={styles.listBox}>
              <h4 className={styles.title}>
                <FormattedMessage id="concacts" />
              </h4>
              <ul>
                <li className={styles.listItem}>
                  <a className={styles.link} href="tel: +380675092050">
                    <FormattedMessage id="connection" />
                    <br /> +38 (067) 509 20 50
                  </a>
                </li>
                <li>
                  <a className={styles.link} href="mailto:book@veze.club">
                    Email: book@veze.club
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.listBox}>
              <h4 className={styles.title}>
                <FormattedMessage id="documents" />
              </h4>
              <ul>
                <li className={styles.listItem}>
                  <a className={styles.link} href={getOfferta(lang)} target="_blanc">
                    <FormattedMessage id="offer" />
                  </a>
                </li>
                <li>
                  <a className={styles.link} href={getPk(lang)} target="_blanc">
                    <FormattedMessage id="privacyPolicy" />
                  </a>
                </li>
                <li className={styles.link}>
                  <Link to="/agent" style={{ color: "var(--color-main)" }}>
                    Агентам
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.listBox}>
              <h4 className={styles.title}>
                <FormattedMessage id="applications" />
              </h4>
              <div className={styles.flexImgs}>
                <div className={styles.img}>
                  <a href="https://play.google.com/store/apps/details?id=com.veze.gds">
                    <img src={play} width="150px" height="44px" alt="playMarket"></img>
                  </a>
                </div>
                <div className={styles.img}>
                  <img src={app} width="150px" height="44px" alt="appStore"></img>
                </div>
              </div>
            </div>
          </div>

          <p>
            &copy; {new Date().getFullYear()}, Veze.{" "}
            <span>
              <FormattedMessage id="allRights" />
            </span>
          </p>
        </div>
      </footer>
    </IntlProvider>
  );
};

export default Fotter;
