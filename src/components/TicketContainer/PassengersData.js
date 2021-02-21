import React from "react";
import { useSelector } from "react-redux";
import styles from "./PassengersData.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";

const PassengersData = () => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket)
  const locale = lang === "UA" ? "UK" : lang;
  const getPassengersData = (id, type) => {
    return ticket.customers[`${id}`][`${type}`];
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.passangersBox}>
        <h4 className={styles.subTitle}>
          <FormattedMessage id="passangersData" />
        </h4>
        <ul>
          {ticket.services.map((el, idx) => (
            <li key={idx}>
              <div className={styles.header}>
                <p className={styles.number}>
                  <FormattedMessage id="passenger" />
                  {idx + 1}
                </p>
                <p className={styles.price}>
                  <span>
                    <FormattedMessage id="cost" />
                  </span>
                  {el.price.amount} UAH
                </p>
              </div>
              <div className={styles.passangerData}>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="name" />
                  </p>
                  <p className={styles.passangerName}>
                    {getPassengersData(el.customer.id, "name")}
                  </p>
                </div>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="surname" />
                  </p>
                  <p className={styles.passangerName}>
                    {getPassengersData(el.customer.id, "surname")}
                  </p>
                </div>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="phone" />
                  </p>
                  <p className={styles.passangerName}>
                    {getPassengersData(el.customer.id, "phone")}
                  </p>
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
