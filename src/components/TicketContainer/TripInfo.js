import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./TripInfo.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getCity, getDate, getStop, getTime } from "../../services/getInfo";

const TripInfo = () => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const [routs, setRouts] = useState([]);
  const locale = lang === "UA" ? "UK" : lang;

  useEffect(() => {
    if (Object.keys(ticket).length > 0) {
      const arr = [];
      for (let [key, values] of Object.entries(ticket.segments)) {
        arr.push({ [key]: values });

        setRouts(
          arr.sort((a, b) => {
            const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
            const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
            return A - B;
          })
        );
      }
    }
  }, [ticket]);

  return (
    <>
      {routs.length > 0 && (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div className={styles.orderBox}>
            <h4 className={styles.subTitle}>
              <FormattedMessage id="trip" />
            </h4>
            <div className={styles.arrow}>
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
                {getDate(
                  "departureDate",
                  ticket.segments[Object.keys(routs[0])[0]],
                  lang
                )}{" "}
                {getTime(
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
                {getTime(
                  "arrivalDate",
                  ticket.segments[Object.keys(routs[routs.length - 1])[0]],
                  lang
                )}
              </p>
            </div>
          </div>
        </IntlProvider>
      )}
    </>
  );
};

export default TripInfo;
