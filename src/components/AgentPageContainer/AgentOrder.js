import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./AgentOrder.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getCity, getDate, getStop, getTimeDisplay } from "../../services/getInfo";

const AgentOrder = ({ order }) => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  const [passangers, setPassangers] = useState([]);
  const [routs, setRouts] = useState([]);
  console.log(order);
  useEffect(() => {
    if (Object.keys(order).length > 0) {
      const arr = [];
      for (let values of Object.values(order.customers)) {
        arr.push({ values });
        // console.log(arr)
      }
      setPassangers(arr);

      const arr2 = [];
      for (let [key, values] of Object.entries(order.segments)) {
        arr2.push({ [key]: values });
      }
      setRouts(
        arr2.sort((a, b) => {
          const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
          const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
          return A - B;
        })
      );
    }
  }, []);
  //   console.log(passangers);
  const getTotalPrice = () =>
    order.services
      .filter((el) => el.hasOwnProperty("segment"))
      .reduce((acc, el) => {
        return acc + el.price.amount;
      }, 0);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="container">
        <div className={styles.order}>
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
                  {getDate(
                    "departureDate",
                    order.segments[Object.keys(routs[0])[0]],
                    lang
                  )}{" "}
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
                        {(getTotalPrice() / passangers.length).toFixed(2)}{" "}
                        <small>
                          <FormattedMessage id="uah" />
                        </small>
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
          )}
        </div>
      </div>
    </IntlProvider>
  );
};

export default AgentOrder;
