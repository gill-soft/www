import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import styles from "./PaymentBox.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getCity, getDate, getExpireTime } from "../../services/getInfo";
import { isGooglePayComfirm } from "../../services/api";
import Modal from "../Modal/Modal";
import GoHome from "../GoHome/GoHome";
import Loader from "../Loader/Loader";
import GooglePayButton from "@google-pay/button-react";
import { useHistory } from "react-router-dom";

const PaymentBox = ({ routs, orderId, primary, secondary }) => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const locale = lang === "UA" ? "UK" : lang;
  const [time, setTime] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [googleRes, setGoogleRes] = useState(null);
  const [primaryData, setPrimaryData] = useState(null);
  const [secondaryData, setSecondaryData] = useState(null);
  const [go3ds, setGo3ds] = useState(false);
  const [order, setOrder] = useState("");
  const history = useHistory();

  // ==== расшифровуем данные ==== //
  useEffect(() => {
    setOrder(CryptoJS.AES.decrypt(atob(orderId), "KeyVeze").toString(CryptoJS.enc.Utf8));
    setPrimaryData(
      JSON.parse(
        CryptoJS.AES.decrypt(atob(primary), "KeyVeze").toString(CryptoJS.enc.Utf8)
      )
    );
    setSecondaryData(
      JSON.parse(
        CryptoJS.AES.decrypt(atob(secondary), "KeyVeze").toString(CryptoJS.enc.Utf8)
      )
    );
  }, []);

  // ==== обрабатываем ответ после оплаты googlePay ==== //
  useEffect(() => {
    if (googleRes) {
      if (googleRes.need3ds) {
        setGo3ds(true);
      }
      if (!googleRes.payed) {
        history.push(`/myTicket/${orderId}/${primaryData.paymentParamsId}`);
      }
    }
  }, [googleRes]);

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

  const handleClick = () => {
    setIsLoader(true);
  };

  return (
    <>
      {routs.length > 0 && (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div className={styles.warning}>
            <p className={styles.warningText}>
              <FormattedMessage id="endTime" />
              <span> {getExpireTime(ticket.services[0].expire, locale)}</span>
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
              <p>Сума до сплати: </p>
              <p className={styles.total}>
                {getTotalPrice().toFixed(2)}
                <small> грн</small>
              </p>
            </div>
            <div className={styles.flexItem}>
              <p>сплатити за допомогою:</p>
              {primaryData.sellerToken ==="sellerToken" && (
                <GooglePayButton
                  environment="TEST"
                  paymentRequest={{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                      {
                        type: "CARD",
                        parameters: {
                          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                          allowedCardNetworks: ["MASTERCARD", "VISA"],
                        },
                        tokenizationSpecification: {
                          type: "PAYMENT_GATEWAY",
                          parameters: {
                            gateway: primaryData.gpayGateway,
                            gatewayMerchantId: primaryData.gpayMerchantId,
                          },
                        },
                      },
                    ],
                    merchantInfo: {
                      merchantId: primaryData.gpayMerchantId,
                      merchantName: "Demo Merchant",
                    },
                    transactionInfo: {
                      totalPriceStatus: "FINAL",
                      totalPriceLabel: "Total",
                      totalPrice: "4.00",
                      currencyCode: "UAH",
                      countryCode: "UA",
                    },
                  }}
                  onLoadPaymentData={(paymentRequest) => {
                    isGooglePayComfirm(paymentRequest, order, primaryData.paymentParamsId)
                      .then(({ data }) => setGoogleRes(data))
                      .catch((err) => console.log(err));
                  }}
                />
              )}

              {/* Portmone */}
              <form action="https://www.portmone.com.ua/gateway/" method="post">
                <input type="hidden" name="payee_id" value={secondaryData.payeeId} />

                <input type="hidden" name="shop_order_number" value={ticket.orderId} />
                <input
                  type="hidden"
                  name="bill_amount"
                  value={getTotalPrice().toFixed(2)}
                />
                <input
                  type="hidden"
                  name="description"
                  value={`${getCity(
                    ticket.segments[Object.keys(routs[0])[0]].departure.id,
                    ticket,
                    lang
                  )} - ${getCity(
                    ticket.segments[Object.keys(routs[routs.length - 1])[0]].arrival.id,
                    ticket,
                    lang
                  )} 
              ${getDate("departureDate", ticket.segments[Object.keys(routs[0])[0]], lang)}
              `}
                />
                <input
                  type="hidden"
                  name="success_url"
                  value={`http://localhost:3000/myTicket/${orderId}/${secondaryData.paymentParamsId}`}
                  // value={`https://site.busis.eu/myTicket/${orderId}/${secondary.paymentParamsId}`}
                />
                <input
                  type="hidden"
                  name="failure_url"
                  value={`http://localhost:3000/ticket/${orderId}/${primary}/${secondary}`}
                  // value={`https://site.busis.eu/ticket/${orderId}/${primary}/${secondary}`}
                />
                <input type="hidden" name="lang" value={locale.toLowerCase()} />
                <input type="hidden" name="encoding" value="UTF-8" />
                {/* <input type="hidden" name="exp_time" value={(time / 1000).toFixed()} /> */}
                <input type="hidden" name="exp_time" value={"1000"} />

                <button
                  className={styles.portmone}
                  type="submit"
                  onClick={handleClick}
                ></button>
              </form>
            </div>
            
          </div>

          {/* {!!isModal && <Modal component={<GoHome />} isGohome={true} />} */}
        </IntlProvider>
      )}
      {isLoader && <Loader />}
    </>
  );
};

export default PaymentBox;
