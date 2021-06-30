import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./AgentOrder.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getCity, getDate, getStop, getTimeDisplay } from "../../services/getInfo";

const AgentOrder = ({ order, idx }) => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  const [passangers, setPassangers] = useState([]);
  const [routs, setRouts] = useState([]);
  const bgnd = idx % 2 === 0;
  useEffect(() => {
    setPassangers(order.services.filter((el) => el.hasOwnProperty("segment")));
    const arr = [];
    for (let [key, values] of Object.entries(order.segments)) {
      arr.push({ [key]: values });
    }
    setRouts(
      arr.sort((a, b) => {
        const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
        const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
        return A - B;
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={`${styles.box} ${bgnd ? styles.gray : null}`}>
        <h4 className={styles.title}><FormattedMessage id="order"/> {order.orderId}</h4>
        {routs.length > 0 && (
          <div className={styles.orderBox}>
            <div>
              <p className={styles.locality}>
                {getCity(
                  order.segments[Object.keys(routs[0])[0]].departure.id,
                  order,
                  lang
                )}
              </p>
              <p className={styles.localityStop}>
                {getStop(
                  order.segments[Object.keys(routs[0])[0]].departure.id,
                  order,
                  lang
                )}
              </p>
              <p className={styles.date}>
                {getDate("departureDate", order.segments[Object.keys(routs[0])[0]], lang)}{" "}
                {getTimeDisplay(
                  "departureDate",
                  order.segments[Object.keys(routs[0])[0]],
                  lang
                )}
              </p>
            </div>
            <div>
              <p className={styles.locality}>
                {getCity(
                  order.segments[Object.keys(routs[routs.length - 1])[0]].arrival.id,
                  order,
                  lang
                )}
              </p>
              <p className={styles.localityStop}>
                {getStop(
                  order.segments[Object.keys(routs[routs.length - 1])[0]].arrival.id,
                  order,
                  lang
                )}
              </p>
              <p className={styles.date}>
                {getDate(
                  "arrivalDate",
                  order.segments[Object.keys(routs[routs.length - 1])[0]],
                  lang
                )}{" "}
                {getTimeDisplay(
                  "arrivalDate",
                  order.segments[Object.keys(routs[routs.length - 1])[0]],
                  lang
                )}
              </p>
            </div>
          </div>
        )}
        {passangers.length > 0 && (
          <div>
            <ul>
              {passangers.map((el, idx) => (
                <li key={idx}>
                  <div className={styles.header}>
                    <p className={styles.number}>
                      <FormattedMessage id="passenger" />
                      {idx + 1}
                    </p>
                  </div>
                  <div className={styles.passangerData}>
                    <p className={styles.passangerName}>
                      {order.customers[el.customer.id].name}
                      {order.customers[el.customer.id].surname}{" "}
                      {order.customers[el.customer.id].phone}
                    </p>
                    <p className={styles.price}>
                      <span>
                        <FormattedMessage id="cost" />
                      </span>{" "}
                      {el.price.amount}
                      <small>
                        <FormattedMessage id="uah" />
                      </small>
                    </p>
                    <p><FormattedMessage id="status"/> {el.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </IntlProvider>
  );
};

export default AgentOrder;
