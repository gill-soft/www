import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Timer.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getExpireTime } from "../../services/getInfo";

const Timer = () => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const locale = lang === "UA" ? "UK" : lang;
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timeEnd = new Date(ticket.services[0].expire).getTime();
    const timeStart = new Date().getTime();
    setTime(timeEnd - timeStart);
  }, [ticket]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(time - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.warning}>
        <p className={styles.warningText}>
          <FormattedMessage id="endTime" />
          <span>{getExpireTime(ticket.services[0].expire, lang)}</span>
        </p>
        <p className={styles.time}>
          {new Date(time).toLocaleString("uk", {
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
    </IntlProvider>
  );
};

export default Timer;
