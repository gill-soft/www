import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { fetchStops } from "../redux/order/orderOperation";
import { getExpireTime } from "../services/getInfo";
import styles from "./TicketPage.module.css";

const TicketPage = ({
  match,
  fetchStops,
  ticket,
  from,
  fromStop,
  to,
  toStop,
  departureDate,
  arrivalDate,
  lang,
  history,
}) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const id = match.params.id;
    fetchStops(id);
  }, [match.params.id, fetchStops]);

  useEffect(() => {
    if (Object.keys(ticket).length > 0) {
      const timeEnd = new Date(ticket.services[0].expire).getTime();
      const timeStart = new Date().getTime();
      setTime(timeEnd - timeStart);
    }
  }, [ticket]);

  useEffect(() => {
    if (time < 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setTime(time - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const getName = (id, type) => {
    return ticket.customers[`${id}`][`${type}`];
  };
  // console.log(time);
  return (
    <div className={styles.bgnd}>
      <div className={styles.container}>
        {Object.keys(ticket).length > 0 && (
          <>
            <div className={styles.orderBox}>
              <h4 className={styles.subTitle}>Маршрут:</h4>
              <div className={styles.arrow}>
                <p className={styles.locality}>{from}</p>
                <p className={styles.localityStop}>{fromStop}</p>
                <p className={styles.date}>{departureDate}</p>
              </div>
              <div>
                <p className={styles.locality}>{to}</p>
                <p className={styles.localityStop}>{toStop}</p>
                <p className={styles.date}>{arrivalDate}</p>
              </div>
            </div>

            <div className={styles.passangersBox}>
              <h4 className={styles.subTitle}>Данные о пассажирах:</h4>
              <ul>
                {ticket.services.map((el, idx) => (
                  <li key={idx}>
                    <div className={styles.header}>
                      <p className={styles.number}>Пассажир №:{idx + 1}</p>
                      <p className={styles.price}>
                        <span>Стоимость: </span>
                        {el.price.amount} грн
                      </p>
                    </div>
                    <div className={styles.passangerData}>
                      <div>
                        <p className={styles.passangerTitle}>Имя</p>
                        <p className={styles.passangerName}>
                          {getName(el.customer.id, "name")}
                        </p>
                      </div>
                      <div>
                        <p className={styles.passangerTitle}>Фамилия</p>
                        <p className={styles.passangerName}>
                          {getName(el.customer.id, "surname")}
                        </p>
                      </div>
                      <div>
                        <p className={styles.passangerTitle}>Телефон</p>
                        <p className={styles.passangerName}>
                          {getName(el.customer.id, "phone")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.payment}>
              <div className={styles.warning}>
                <p className={styles.warningText}>
                  {" "}
                  Для оформления заказа оплатите его до:{" "}
                  <span>{getExpireTime(ticket.services[0].expire, lang)}</span>
                </p>
                <p className={styles.time}>
                  {new Date(time).toLocaleString("uk", {
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </>
        )}

        <pre>{JSON.stringify(ticket, null, 4)} </pre>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticket: state.order.ticket,
  lang: state.language,
  from: state.order.order.from,
  to: state.order.order.to,
  fromStop: state.order.order.fromStop,
  toStop: state.order.order.toStop,
  departureDate: state.order.order.departureDate,
  arrivalDate: state.order.order.arrivalDate,
  price: state.order.order.price,
});

const mapDispatchToProps = (dispatch) => ({
  fetchStops: (id) => dispatch(fetchStops(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketPage);
