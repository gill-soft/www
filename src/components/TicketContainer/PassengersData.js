import React from "react";
import { useSelector } from "react-redux";
import styles from "./PassengersData.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getPassangers, getTicket } from "../../redux/order/orderSelectors";
import { getLang } from "../../redux/Language/LanguageSelectors";

const PassengersData = ({ status = false }) => {
  const lang = useSelector(getLang);
  const ticket = useSelector(getTicket);
  const passangers = useSelector(getPassangers);
  const locale = lang === "UA" ? "UK" : lang;

  const getResultNew = () => {
    const expireTime = ticket.services[0].expire.split(" ").join("T");
    const msExpireTime = new Date(expireTime).getTime();
    const msNow = new Date().getTime();
    if (msExpireTime > msNow) {
      return "Квиток заброньвано";
    } else {
      return "Час бронювання закінчився";
    }
  };
  const getStatus = (status) => {
    let result;
    switch (status) {
      case "NEW":
        result = getResultNew();
        break;
      case "CONFIRM":
        result = "Квиток сплачено";
        break;
      case "RETURN":
        result = "Квиток повернено";
        break;

      default:
        result = status;
        break;
    }
    return result;
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.passangersBox}>
        <h4 className={styles.subTitle}>
          <FormattedMessage id="passangersData" />
        </h4>
        <ul>
          {passangers.map((el, idx) => (
            <li key={idx}>
              <div className={styles.header}>
                <p className={styles.number}>
                  <FormattedMessage id="passenger" />
                  {idx + 1}
                </p>
                <p className={styles.price}>
                  <span>
                    <FormattedMessage id="cost" />
                  </span>{" "}
                  {el.price.amount}{" "}
                  <small>
                    <FormattedMessage id="uah" />
                  </small>
                </p>
                {status && <p className={styles.status}>{getStatus(el.status)}</p>}
              </div>
              <div className={styles.passangerData}>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="name" />
                  </p>
                  <p className={styles.passangerName}>
                    {ticket.customers[el.customer.id].name}
                  </p>
                </div>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="surname" />
                  </p>
                  <p className={styles.passangerName}>
                    {ticket.customers[el.customer.id].surname}
                  </p>
                </div>
                <div>
                  <p className={styles.passangerTitle}>
                    <FormattedMessage id="phone" />
                  </p>
                  <p className={styles.passangerName}>
                    {ticket.customers[el.customer.id].phone}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </IntlProvider>
  );
};

export default PassengersData;
