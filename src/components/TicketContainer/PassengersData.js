import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./PassengersData.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";

const PassengersData = () => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const locale = lang === "UA" ? "UK" : lang;
  const [passangers, setPassangers] = useState([]);

  useEffect(() => {
    if (Object.keys(ticket).length > 0) {
      const arr = [];
      for (let values of Object.values(ticket.customers)) {
        arr.push({ values });
        setPassangers(arr);
      }
    }
  }, [ticket]);

  const getTotalPrice = () =>
    ticket.services
      .filter((el) => el.hasOwnProperty("segment"))
      .reduce((acc, el) => {
        return acc + el.price.amount;
      }, 0);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.passangersBox}>
        <h4 className={styles.subTitle}>
          <FormattedMessage id="passangersData" />
        </h4>
        <ul>
          {passangers.map((el, idx) => (
            <li key={idx}>
              <div className={styles.header}>
                <p className={styles.number}>
                  <FormattedMessage id="passenger" />
                  {idx + 1}
                </p>
                <p className={styles.price}>
                  <span>
                    <FormattedMessage id="cost" />
                  </span>{" "}
                  {(getTotalPrice() / passangers.length).toFixed(2)} <small>UAH</small>
                </p>
              </div>
              <div className={styles.passangerData}>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="name" />
                  </p>
                  <p className={styles.passangerName}>{el.values.name}</p>
                </div>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="surname" />
                  </p>
                  <p className={styles.passangerName}>{el.values.surname}</p>
                </div>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="phone" />
                  </p>
                  <p className={styles.passangerName}>{el.values.phone}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </IntlProvider>
  );
};

export default PassengersData;
