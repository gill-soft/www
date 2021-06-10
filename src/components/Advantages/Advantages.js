import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessages";
import styles from "./Advantages.module.css";
import busIcon from "../../images/bus-icon-min.png";
import scheduleIcon from "../../images/schedule-icon-min.png";
import timeIcon from "../../images/time-icon-min.png";
import wifiIcon from "../../images/wifi-icon-min.png";
import servicesIcon from "../../images/services-icon-min.png";
import teaIcon from "../../images/tea-icon-min.png";

const Advantages = () => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <FormattedMessage id="whyWe" />
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <div className={styles.imgBox}>
              <img
                src={busIcon}
                width="30px"
                height="30px"
                alt="автобусні маршрути"
              ></img>
            </div>
            <p>
              <FormattedMessage id="сomfort" />
            </p>
          </li>
          <li className={styles.listItem}>
            <div className={styles.imgBox}>
              <img
                src={scheduleIcon}
                width="30px"
                height="30px"
                alt="розклад автобусів"
              ></img>
            </div>
            <p>
              <FormattedMessage id="schedule" />
            </p>
          </li>
          <li className={styles.listItem}>
            <div className={styles.imgBox}>
              <img
                src={timeIcon}
                width="30px"
                height="30px"
                alt="маршрути автобусів"
              ></img>
            </div>

            <p>
              <FormattedMessage id="timeInWay" />{" "}
            </p>
          </li>
          <li className={styles.listItem}>
            <div className={styles.imgBox}>
              <img
                src={teaIcon}
                width="30px"
                height="30px"
                alt="чай кава в автобусі"
              ></img>
            </div>
            <p>
              <FormattedMessage id="teaCoffe" />
            </p>
          </li>
          <li className={styles.listItem}>
            <div className={styles.imgBox}>
              <img src={wifiIcon} width="30px" height="30px" alt="wifi в автобусі"></img>
            </div>
            <p>WiFi</p>
          </li>
          <li className={styles.listItem}>
            <div className={styles.imgBox}>
              <img
                src={servicesIcon}
                width="30px"
                height="30px"
                alt="сервіс в автобусі"
              ></img>
            </div>
            <p><FormattedMessage id="service" /></p>
          </li>
        </ul>
      </div>
    </IntlProvider>
  );
};

export default Advantages;
