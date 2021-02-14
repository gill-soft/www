import { connect } from "react-redux";
import React from "react";
import styles from "./OrderInfo.module.css";

const OrderInfo = ({
  from,
  to,
  price,
  departureDate,
  arrivalDate,
  fromStop,
  toStop,
  total,
}) => {
  const getTotalPrice = () => {
    return (total * price).toFixed(2);
  };
  return (
    <div>
      <h3 className={styles.title}>Детали заказа</h3>
      <div className={styles.orderBox}>
        <h4 className={styles.subTitle}>Отправление</h4>
        <p className={styles.locality}>{from}</p>
        <p className={styles.localityStop}>{fromStop}</p>
        <p className={styles.date}>{departureDate}</p>
        <h4 className={styles.subTitle}>Прибытие</h4>
        <p className={styles.locality}>{to}</p>
        <p className={styles.localityStop}>{toStop}</p>
        <p className={styles.date}>{arrivalDate}</p>
        <p className={styles.total}>К оплате: {getTotalPrice()} грн</p>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  from: state.order.order.from,
  to: state.order.order.to,
  fromStop: state.order.order.fromStop,
  toStop: state.order.order.toStop,
  departureDate: state.order.order.departureDate,
  arrivalDate: state.order.order.arrivalDate,
  price: state.order.order.price,
});

export default connect(mapStateToProps)(OrderInfo);
