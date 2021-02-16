import { connect } from "react-redux";
import React from "react";
import styles from "./OrderInfo.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/OrderPageMessanges";
import { getLocality, getStop } from "../../services/getInfo";

const OrderInfo = ({
  to,
  from,
  lang,
  stops,
  price,
  trips,
  total,
  toStop,
  fromStop,
  arrivalDate,
  departureDate,
}) => {
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
const mapStateToProps = (state) => ({
  from: state.order.order.from,
  to: state.order.order.to,
  fromStop: state.order.order.fromStop,
  toStop: state.order.order.toStop,
  departureDate: state.order.order.departureDate,
  arrivalDate: state.order.order.arrivalDate,
  price: state.order.order.price,
  lang: state.language,
  stops: state.global.stops,
  trips: state.trips.trips
});

export default connect(mapStateToProps)(OrderInfo);
