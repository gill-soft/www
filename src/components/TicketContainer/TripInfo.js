import React from "react";
import { useSelector } from "react-redux";
import styles from "./TripInfo.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getCity, getDate, getStop, getTimeDisplay } from "../../services/getInfo";

const TripInfo = ({ routs }) => {
  
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.orderBox}>
        <h4 className={styles.subTitle}>
          <FormattedMessage id="trip" />
        </h4>
        <div>
          <p className={styles.locality}>
            {getCity(
              ticket.segments[Object.keys(routs[0])[0]].departure.id,
              ticket,
              lang
            )}
          </p>
          <p className={styles.localityStop}>
            {getStop(
              ticket.segments[Object.keys(routs[0])[0]].departure.id,
              ticket,
              lang
            )}
          </p>
          <p className={styles.date}>
            {getDate("departureDate", ticket.segments[Object.keys(routs[0])[0]], lang)}{" "}
            {getTimeDisplay(
              "departureDate",
              ticket.segments[Object.keys(routs[0])[0]],
              lang
            )}
          </p>
        </div>
        <div>
          <p className={styles.locality}>
            {getCity(
              ticket.segments[Object.keys(routs[routs.length - 1])[0]].arrival.id,
              ticket,
              lang
            )}
          </p>
          <p className={styles.localityStop}>
            {getStop(
              ticket.segments[Object.keys(routs[routs.length - 1])[0]].arrival.id,
              ticket,
              lang
            )}
          </p>
          <p className={styles.date}>
            {getDate(
              "arrivalDate",
              ticket.segments[Object.keys(routs[routs.length - 1])[0]],
              lang
            )}{" "}
            {getTimeDisplay(
              "arrivalDate",
              ticket.segments[Object.keys(routs[routs.length - 1])[0]],
              lang
            )}
          </p>
        </div>
      </div>
    </IntlProvider>
  );
};

export default TripInfo;
