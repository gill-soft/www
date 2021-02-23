import React from "react";
import { useSelector } from "react-redux";
import styles from "./TripInfo.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getLocality } from "../../services/getInfo";

const TripInfo = ({ fromId, toId, getDate }) => {
  const lang = useSelector((state) => state.language);
  const stops = useSelector((state) => state.global.stops);
  const ticket = useSelector((state) => state.order.ticket);

  const locale = lang === "UA" ? "UK" : lang;

  // ==== получаем название остановки отправки/прибытия ====//
  const getStop = (type) => {
    const tripKey = Object.keys(ticket.segments)[0];
    const id = ticket.segments[`${tripKey}`][`${type}`].id;
    return ticket.localities[`${id}`].name[`${lang}`];
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.orderBox}>
        <h4 className={styles.subTitle}>
          <FormattedMessage id="trip" />
        </h4>
        <div className={styles.arrow}>
          <p className={styles.locality}>{getLocality(fromId, stops, lang)}</p>
          <p className={styles.localityStop}>{getStop("departure")}</p>
          <p className={styles.date}>{getDate("departureDate")}</p>
        </div>
        <div>
          <p className={styles.locality}>{getLocality(toId, stops, lang)}</p>
          <p className={styles.localityStop}>{getStop("arrival")}</p>
          <p className={styles.date}>{getDate("arrivalDate")}</p>
        </div>
      </div>
    </IntlProvider>
  );
};

export default TripInfo;
