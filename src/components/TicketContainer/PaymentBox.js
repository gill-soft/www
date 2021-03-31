import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import styles from "./PaymentBox.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getExpireTime, getLocality } from "../../services/getInfo";
// import { fetchPayeeId } from "../../services/api";
import Modal from "../Modal/Modal";
import GoHome from "../GoHome/GoHome";

const PaymentBox = ({ id, fromId, toId, getDate, payeeId }) => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const stops = useSelector((state) => state.global.stops);
  const locale = lang === "UA" ? "UK" : lang;
  const [time, setTime] = useState(0);
  const [isModal, setIsModal] = useState(false);

  // ==== определяем время до конца оплаты ==== //
  useEffect(() => {
    const timeEnd = new Date(ticket.services[0].expire).getTime();
    const timeStart = new Date().getTime();
    setTime(timeEnd - timeStart);
  }, [ticket.services]);

  useEffect(() => {
    if (time < 0) {
      setIsModal(true);
      setTime(0);
      return;
    }
    const intervalId = setInterval(() => {
      setTime(time - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const getTotalPrice = () =>
    ticket.services.reduce((acc, el) => {
      return acc + el.price.amount;
    }, 0);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.warning}>
        <p className={styles.warningText}>
          <FormattedMessage id="endTime" />
          <span> {getExpireTime(ticket.services[0].expire, lang)}</span>
        </p>
        <p className={styles.time}>
          {new Date(time).toLocaleString("uk", {
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
      <div className={styles.payment}>
        <div className={styles.flexItem}>
          <p>сплатити за допомогою:</p>
          <form action="https://www.portmone.com.ua/gateway/" method="post">
            <input
              type="hidden"
              name="payee_id"
              value={CryptoJS.AES.decrypt(atob(payeeId), "KeyVezu").toString(
                CryptoJS.enc.Utf8
              )}
            />
            <input type="hidden" name="shop_order_number" value={ticket.orderId} />
            <input type="hidden" name="bill_amount" value={getTotalPrice()} />
            <input
              type="hidden"
              name="description"
              value={`${getLocality(fromId, stops, lang)} -
                     ${getLocality(toId, stops, lang)} ${getDate("departureDate")}`}
            />
            <input
              type="hidden"
              name="success_url"
              // value={`http://localhost:3000/myTicket/${id}`}
              value={`https://site.busis.eu/myTicket/${id}`}
            />
            <input
              type="hidden"
              name="failure_url"
              // value={`http://localhost:3000/ticket/${id}/${payeeId}`}
              value={`https://site.busis.eu/ticket/${id}/${payeeId}`}
            />
            <input type="hidden" name="lang" value={locale.toLowerCase()} />
            <input type="hidden" name="encoding" value="UTF-8" />
            <input type="hidden" name="exp_time" value={(time / 1000).toFixed()} />
            <button className={styles.portmone} type="submit"></button>
          </form>
        </div>
        <div className={styles.flexItem}>
          <p>Сума до сплати: </p>
          <p className={styles.total}>
            {getTotalPrice()}
            <small> грн</small>
          </p>{" "}
        </div>
      </div>
      {!!isModal && <Modal component={<GoHome />} isGohome={true} />}
    </IntlProvider>
  );
};

export default PaymentBox;
