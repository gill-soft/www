import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import Modal from "@material-ui/core/Modal";
import { IntlProvider, FormattedMessage } from "react-intl";
import GooglePayButton from "@google-pay/button-react";
import styles from "./PaymentBox.module.css";
import { messages } from "../../intl/TicketPageMessanges";
import { getCity, getDate, getExpireTime, getExpireDate } from "../../services/getInfo";
import { isGooglePayComfirm } from "../../services/api";
import GoHome from "../GoHome/GoHome";
import Loader from "../Loader/Loader";
import visa from "../../images/visa-min.png";
import mastercard from "../../images/Mastercard-min.png";
import maestro from "../../images/maestro-min.png";
import ReturnConditions from "./ReturnConditions";

const PaymentBox = ({ routs, orderId }) => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const locale = lang === "UA" ? "UK" : lang;
  const [time, setTime] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [googleRes, setGoogleRes] = useState(null);
  const [order, setOrder] = useState("");

  const [isModal, setIsModal] = useState(false);
  const [segments, setSegments] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);
  const history = useHistory();

  const ref = useRef();
  // ==== расшифровуем данные ==== //
  useEffect(() => {
    setOrder(CryptoJS.AES.decrypt(atob(orderId), "KeyVeze").toString(CryptoJS.enc.Utf8));
    // setPrimaryData(
    //   JSON.parse(
    //     CryptoJS.AES.decrypt(atob(primary), "KeyVeze").toString(CryptoJS.enc.Utf8)
    //   )
    // );
    // setSecondaryData(
    //   JSON.parse(
    //     CryptoJS.AES.decrypt(atob(secondary), "KeyVeze").toString(CryptoJS.enc.Utf8)
    //   )
    // );
    // ==== расчитываем полную стоимость билета ====//
    settotalPrice(getTotalPrice().toFixed(2));

    // ==== определяем время до конца оплаты ==== //
    // преобразовуем дату в массив
    const dateArray = ticket.services[0].expire.split(" ");
    // определям милисекунды даты
    const dayMs = new Date(dateArray[0]).getTime();
    // определяем милисикунды времени
    const timeMs =
      dateArray[1].split(":")[0] * 60 * 60 * 1000 +
      dateArray[1].split(":")[1] * 60 * 1000;
    // разница миллисикунд
    const timeEnd = dayMs + timeMs;
    const timeStart = new Date().getTime();
    setTime(timeEnd - timeStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ==== обрабатываем ответ после оплаты googlePay ==== //
  useEffect(() => {
    if (googleRes) {
      // ==== если нужно подтверждение 3ds ==== //
      if (googleRes.need3ds) {
        ref.current.submit();
        return;
      }
      //  ==== если оплата подтверждена ==== //
      if (googleRes.payed) {
        history.push(
          `/myTicket/${orderId}/${ticket.primaryPaymentParams.paymentParamsId}`
        );
      }
      setIsLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleRes]);

  //  ==== секундомер ==== //
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

  const getTotalPrice = () => {
    return ticket.services.reduce((acc, el) => {
      return acc + el.price.amount;
    }, 0);
  };
  const getGooleplayConfirm = (paymentRequest) => {
    isGooglePayComfirm(paymentRequest, order, ticket.primaryPaymentParams.paymentParamsId)
      .then(({ data }) => setGoogleRes(data))
      .catch((err) => console.log(err));
  };
  const handleClick = () => {
    setIsLoader(true);
  };
  const handleClickReturn = () => {
    segments.length > 0
      ? setSegments([])
      : setSegments(
          ticket.services
            .reduce((arr, el) => {
              if (el.hasOwnProperty("segment")) arr.push(el);
              return arr;
            }, [])
            .reduce(
              (acc, el) => {
                if (acc.map[el.segment.id]) return acc;

                acc.map[el.segment.id] = true;
                acc.item.push(el);
                return acc;
              },
              { map: {}, item: [] }
            ).item
        );
  };
  const closeReturnConditions = () => {
    setSegments([]);
  };

  return (
    <>
      {/* {ticket && secondaryData && ( */}
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.warning}>
          <p className={styles.warningText}>
            <FormattedMessage id="endTime" />
            <span>
              {" "}
              {getExpireDate(ticket.services[0].expire, locale)}
              {getExpireTime(ticket.services[0].expire)}
            </span>
          </p>
          <p className={styles.time}>
            {new Date(time).toLocaleString("uk", {
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>

        <div className={styles.payment}>
          <div className={styles.infoblock}>
            <p>
              <FormattedMessage id="securityStandart" />
            </p>
            <div className={styles.images}>
              <div className={styles.img}>
                <img src={visa} alt="visa" />
              </div>
              <div className={styles.img}>
                <img src={maestro} alt="visa" />
              </div>
              <div className={styles.img}>
                <img src={mastercard} alt="visa" />
              </div>
            </div>
          </div>
          <div className={styles.flexItem}>
            <p>
              <FormattedMessage id="summ" />
            </p>
            <p className={styles.total}>
              {totalPrice}
              <small> грн</small>
            </p>
          </div>
          {ticket.hasOwnProperty("primaryPaymentParams") &&
            ticket.hasOwnProperty("secondaryPaymentParams") && (
              <>
                <div className={styles.flexItem}>
                  <p>
                    <FormattedMessage id="pay" />
                  </p>
                  <div className={styles.payType}>
                    {ticket.primaryPaymentParams.sellerToken !== "" && (
                      <GooglePayButton
                        className={styles.google}
                        environment="PRODUCTION"
                        buttonType="short"
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
                                  gateway: ticket.primaryPaymentParams.gpayGateway,
                                  gatewayMerchantId:
                                    ticket.primaryPaymentParams.gpayMerchantId,
                                },
                              },
                            },
                          ],
                          merchantInfo: {
                            merchantId: "BCR2DN6TSOFZJADQ",
                            merchantName: "VEZE",
                          },
                          transactionInfo: {
                            totalPriceStatus: "FINAL",
                            totalPriceLabel: "Total",
                            totalPrice: `${totalPrice}`,
                            currencyCode: "UAH",
                            countryCode: "UA",
                          },
                        }}
                        onError={(data) => console.log(data)}
                        onLoadPaymentData={(paymentRequest) => {
                          setIsLoader(true);
                          getGooleplayConfirm(paymentRequest);
                        }}
                      />
                    )}

                    {/* Portmone */}
                    <form action="https://www.portmone.com.ua/gateway/" method="post">
                      <input
                        type="hidden"
                        name="payee_id"
                        value={ticket.secondaryPaymentParams.payeeId}
                      />

                      <input
                        type="hidden"
                        name="shop_order_number"
                        value={ticket.orderId}
                      />
                      <input type="hidden" name="bill_amount" value={totalPrice} />
                      <input
                        type="hidden"
                        name="description"
                        value={`${getCity(
                          ticket.segments[Object.keys(routs[0])[0]].departure.id,
                          ticket,
                          lang
                        )} - ${getCity(
                          ticket.segments[Object.keys(routs[routs.length - 1])[0]].arrival
                            .id,
                          ticket,
                          lang
                        )} 
              ${getDate("departureDate", ticket.segments[Object.keys(routs[0])[0]], lang)}
              `}
                      />
                      <input
                        type="hidden"
                        name="success_url"
                        value={`https://veze.club/myTicket/${orderId}/${ticket.secondaryPaymentParams.paymentParamsId}`}
                      />
                      <input
                        type="hidden"
                        name="failure_url"
                        value={`https://veze.club/ticket/${orderId}`}
                      />
                      <input type="hidden" name="lang" value={locale.toLowerCase()} />
                      <input type="hidden" name="encoding" value="UTF-8" />
                      <input
                        type="hidden"
                        name="exp_time"
                        value={(time / 1000).toFixed()}
                      />

                      <button
                        className={styles.portmone}
                        type="submit"
                        onClick={handleClick}
                      ></button>
                    </form>
                  </div>
                </div>
              </>
            )}

          <button
            type="button"
            onClick={handleClickReturn}
            className={styles.returnConditions}
          >
            <FormattedMessage id="return" />
          </button>
        </div>
        <Modal open={segments.length > 0} onClose={closeReturnConditions}>
          <ReturnConditions segments={segments} close={closeReturnConditions} />
        </Modal>
        <Modal open={isModal} disableBackdropClick={true}>
          <GoHome />
        </Modal>
        {googleRes && (
          <form
            ref={ref}
            id="TheForm"
            action={googleRes.params3ds.action}
            method="POST"
            name="TheForm"
          >
            <input type="hidden" name="PaReq" value={googleRes.params3ds.PaReq} />
            <input type="hidden" name="MD" value={googleRes.params3ds.MD} />
            <input
              type="hidden"
              name="TermUrl"
              value={
                `https://busis.eu/gds-sale/api/v1/transaction/callback/3ds/${orderId}/${ticket.secondaryPaymentParams.paymentParamsId}?` +
                `successURL=` +
                encodeURIComponent(
                  `https://veze.club/myTicket/${orderId}/${ticket.secondaryPaymentParams.paymentParamsId}`
                ) +
                `&errorURL=` +
                encodeURIComponent(`https://veze.club/ticket/${orderId}`)
              }
            />
          </form>
        )}
      </IntlProvider>
      {/* )} */}
      {isLoader && <Loader />}
    </>
  );
};

export default PaymentBox;
