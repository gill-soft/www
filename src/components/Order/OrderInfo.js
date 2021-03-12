import React from "react";
import { useSelector } from "react-redux";
import styles from "./OrderInfo.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/OrderPageMessanges";
import { getLocality, getStop } from "../../services/getInfo";

const OrderInfo = ({ total }) => {
  const to = useSelector((state) => state.order.order.to);
  const from = useSelector((state) => state.order.order.from);
  const lang = useSelector((state) => state.language);
  const trips = useSelector((state) => state.trips.trips);
  const stops = useSelector((state) => state.global.stops);
  const price = useSelector((state) => state.order.order.price);
  const toStop = useSelector((state) => state.order.order.toStop);
  const fromStop = useSelector((state) => state.order.order.fromStop);
  const arrivalDate = useSelector((state) => state.order.order.arrivalDate);
  const departureDate = useSelector((state) => state.order.order.departureDate);
  const locale = lang === "UA" ? "UK" : lang;
  
  const getTotalPrice = () => {
    return (total * price).toFixed(2);
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div>
        <h3 className={styles.title}>
          <FormattedMessage id="details" />
        </h3>
        <div className={styles.orderBox}>
          <h4 className={styles.subTitle}>
            <FormattedMessage id="departure" />
          </h4>
          <p className={styles.locality}>{getLocality(from, stops, lang)}</p>
          <p className={styles.localityStop}>{getStop(fromStop, trips, lang)}</p>
          <p className={styles.date}>{departureDate}</p>
          <h4 className={styles.subTitle}>
            <FormattedMessage id="arrival" />
          </h4>
          <p className={styles.locality}>{getLocality(to, stops, lang)}</p>
          <p className={styles.localityStop}>{getStop(toStop, trips, lang)}</p>
          <p className={styles.date}>{arrivalDate}</p>
          <p className={styles.total}>
            <FormattedMessage id="pay" />
            {getTotalPrice()} грн
          </p>
        </div>
      </div>
    </IntlProvider>
  );
};

export default OrderInfo;
