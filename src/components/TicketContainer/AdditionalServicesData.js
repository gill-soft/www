import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import styles from "./AdditionalServicesData.module.css";
import { getAdditionalServicesKeys, getTicket } from "../../redux/order/orderSelectors";
import { getLang } from "../../redux/Language/LanguageSelectors";

const AdditionalServicesData = () => {
  const ticket = useSelector(getTicket);
  const addServ = useSelector(getAdditionalServicesKeys);
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;

  const getPrice = (key) => {
    return ticket.services
      .filter((el) => el?.additionalService?.id === key)
      .reduce((summ, el) => {
        summ += el.price.amount;
        return summ;
      }, 0);
  };
  return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          {addServ.length > 0 && <div className={styles.box}>
        <h4 className={styles.title}>
          <FormattedMessage id="addservices" />
        </h4>
        <div className={styles.flex}>
          {addServ.map((el) => (
            <div key={el} className={styles.item}>
              <p>
                {ticket.additionalServices[el].name[lang]}:
                <span>
                  {" "}
                  {getPrice(el).toFixed(2)}
                  <small>
                    <FormattedMessage id="uah" />
                  </small>
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>}
      
    </IntlProvider>
  );
};

export default AdditionalServicesData;
