import React from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import styles from '../../pages/TicketPage.module.css'
import {useSelector} from 'react-redux'
import { messages } from "../../intl/TicketPageMessanges";

const TripInfo = ({getStop, getLocality}) => {
 const lang = useSelector(state => state.language)
 console.log(lang)
  const locale = lang === "UA" ? "UK" : lang;



  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.orderBox}>
        <h4 className={styles.subTitle}>
          <FormattedMessage id="trip" />
        </h4>
        <div className={styles.arrow}>
          <p className={styles.locality}>{() => getLocality("departure")}</p>
          <p className={styles.localityStop}>{()=> getStop("departure")}</p>
          {/* <p className={styles.date}>{ticket.segments[`${tripKey}`].departureDate}</p> */}
        </div>
        <div>
          <p className={styles.locality}>{getLocality("arrival")}</p>
          <p className={styles.localityStop}>{getStop("arrival")}</p>
          {/* <p className={styles.date}>{ticket.segments[`${tripKey}`].arrivalDate}</p> */}
        </div>
      </div>
    </IntlProvider>
  );
};

export default TripInfo;
