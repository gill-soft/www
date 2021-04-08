import React from "react";
import { useSelector } from "react-redux";
import styles from "./OrderInfo.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/OrderPageMessanges";
import { getCity, getStop } from "../../services/getInfo";

const OrderInfo = ({ total }) => {
  const lang = useSelector((state) => state.language);
  const trips = useSelector((state) => state.trips.trips);
  const price = useSelector((state) => state.order.order.price);
  const arrivalDate = useSelector((state) => state.order.order.arrivalDate);
  const departureDate = useSelector((state) => state.order.order.departureDate);
  const tripKeys = useSelector((state) => state.order.order.tripKeys);
  const departureKey = useSelector((state) => state.order.order.tripKeys[0]);
  const arrivalKey = useSelector(
    (state) => state.order.order.tripKeys[tripKeys.length - 1]
    );
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
          <p className={styles.locality}>
            {getCity(trips.segments[departureKey].departure.id, trips, lang)}
          </p>
          <p className={styles.localityStop}>
            {getStop(trips.segments[departureKey].departure.id, trips, lang)}
          </p>
          <p className={styles.date}>{departureDate}</p>
          <h4 className={styles.subTitle}>
            <FormattedMessage id="arrival" />
          </h4>
          <p className={styles.locality}>
            {getCity(trips.segments[arrivalKey].arrival.id, trips, lang)}
          </p>
          <p className={styles.localityStop}>
            {getStop(trips.segments[arrivalKey].arrival.id, trips, lang)}
          </p>
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
