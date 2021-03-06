import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "@material-ui/core/Modal";
import { IntlProvider, FormattedMessage } from "react-intl";
import GooglePayButton from "@google-pay/button-react";
import styles from "./PaymentBox.module.css";
import { messages } from "../../intl/TicketPageMessanges";
import { getCity, getDate, getExpireTime, getExpireDate } from "../../services/getInfo";
import { isGooglePayComfirm } from "../../services/api";
import Loader from "../Loader/Loader";
import visa from "../../images/visa-min.png";
import mastercard from "../../images/Mastercard-min.png";
import maestro from "../../images/maestro-min.png";
import ReturnConditions from "./ReturnConditions";
import StopWatch from "./StopWatch";
import { getRouts, getTicket } from "../../redux/order/orderSelectors";
import Discount from "./Discount";
import { getLang } from "../../redux/Language/LanguageSelectors";
import GoogleError from "./GoogleError";

const PaymentBox = ({ orderId }) => {
  const lang = useSelector(getLang);
  const ticket = useSelector(getTicket);
  const routs = useSelector(getRouts);
  const locale = lang === "UA" ? "UK" : lang;
  const [isLoader, setIsLoader] = useState(false);
  const [googleRes, setGoogleRes] = useState(null);
  const [segments, setSegments] = useState([]);
  const [isBonus, setIsBonus] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const user = JSON.parse(localStorage.getItem("auth"));
  const history = useHistory();
  const ref = useRef();

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

  const getGooglePayConfirm = (paymentRequest) => {
    isGooglePayComfirm(
      paymentRequest,
      ticket.orderId,
      ticket.primaryPaymentParams.paymentParamsId
    )
      .then(({ data }) => setGoogleRes(data))
      .catch((err) => setGoogleError(err));
  };

  // ==== расчитываем сумму для оплаты ==== //
  const getTotalPrice = () => {
    const ticketSumm = ticket.services.reduce((acc, el) => {
      return acc + el.price.amount;
    }, 0);

    const bonusSumm = ticket.services
      .filter((el) => el.price.hasOwnProperty("discounts"))
      .map((el) => el.price.discounts)
      .flat()
      .reduce((summ, el) => summ + el.value, 0);

    if (isBonus) {
      return ticketSumm + bonusSumm;
    } else {
      return ticketSumm;
    }
  };

  // ==== расчитываем сумму коммисии агента ==== //
  const getComissionSumm = () => {
    if (user?.type === "USER") {
      return ticket.services
        .map((el) => el.price.commissions)
        .flat()
        .filter((el) => el.code === "AGN_IN_15")
        .reduce((acc, el) => {
          return acc + el.value;
        }, 0);
    } else {
      return 0;
    }
  };

  const handleClick = () => {
    setIsLoader(true);
  };

  //  ==== кнопка условий возврвта ==== //
  const handleClickReturn = () => {
    setSegments(
      ticket.services
        .filter((el) => el.hasOwnProperty("segment"))
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
  //  ==== закрыть условия возврата ==== //
  const closeReturnConditions = () => {
    setSegments([]);
  };
  //  ==== закрыть модалку про ошибку гугл ==== //
  const closeGoogleError = () => {
    setGoogleError("");
  };

  // ==== время оплаты для портмоне ==== //
  const getPortmoneTime = () => {
    const dateEnd = ticket.services[0].expire.split(" ").join("T");
    const timeEnd = new Date(dateEnd).getTime();
    const time = ((timeEnd - Date.now()) / 1000).toFixed();
    return time;
  };

  // ==== использовать бонус ==== //
  const addBonus = (bool) => {
    setIsBonus(bool);
  };
  return (
    <>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.warning}>
          <p className={styles.warningText}>
            <FormattedMessage id="endTime" />
            <span>
              {getExpireDate(ticket.services[0].expire, locale)}
              {getExpireTime(ticket.services[0].expire)}
            </span>
          </p>
          <StopWatch />
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
              {getTotalPrice().toFixed(2)}
              <small>
                <FormattedMessage id="uah" />
              </small>
            </p>
          </div>
          {user?.type === "USER" && (
            <div className={styles.flexItem}>
              <p>Комісія агента: </p>
              <p className={styles.total}>
                {getComissionSumm().toFixed(2)}
                <small>
                  <FormattedMessage id="uah" />
                </small>
              </p>
            </div>
          )}
          {user && <Discount addBonus={addBonus} isBonus={isBonus} />}
          {getTotalPrice() === 0 ? (
            <Link
              to={`/myTicket/${orderId}/${ticket.secondaryPaymentParams.paymentParamsId}`}
              className={styles.bonusBtn}
            >
              <FormattedMessage id="payBonuses" />
            </Link>
          ) : (
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
                        totalPrice: `${
                          getTotalPrice().toFixed(2) - getComissionSumm().toFixed(2)
                        }`,
                        currencyCode: "UAH",
                        countryCode: "UA",
                      },
                    }}
                    onError={(error) => {
                      <Redirect to="/error" />;
                    }}
                    onLoadPaymentData={(paymentRequest) => {
                      setIsLoader(true);
                      getGooglePayConfirm(paymentRequest);
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

                  <input type="hidden" name="shop_order_number" value={ticket.orderId} />
                  <input
                    type="hidden"
                    name="bill_amount"
                    value={getTotalPrice().toFixed(2) - getComissionSumm().toFixed(2)}
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
                    value={`https://www.veze.club/myTicket/${orderId}/${ticket.secondaryPaymentParams.paymentParamsId}`}
                  />
                  <input
                    type="hidden"
                    name="failure_url"
                    value={`https://www.veze.club/ticket/${orderId}`}
                  />
                  <input type="hidden" name="lang" value={locale.toLowerCase()} />
                  <input type="hidden" name="encoding" value="UTF-8" />
                  <input type="hidden" name="exp_time" value={getPortmoneTime()} />

                  <button
                    className={styles.portmone}
                    type="submit"
                    onClick={handleClick}
                  ></button>
                </form>
              </div>
            </div>
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
                `https://busis.eu/gds-sale/api/v1/transaction/callback/3ds/${ticket.orderId}/${ticket.primaryPaymentParams.paymentParamsId}?` +
                `successURL=` +
                encodeURIComponent(
                  `https://www.veze.club/myTicket/${orderId}/${ticket.primaryPaymentParams.paymentParamsId}`
                ) +
                `&errorURL=` +
                encodeURIComponent(`https://www.veze.club/ticket/${orderId}`)
              }
            />
          </form>
        )}
      </IntlProvider>
      <Modal open={!!googleError} onClose={closeGoogleError}>
        <GoogleError close={closeGoogleError} />
      </Modal>
      {isLoader && <Loader />}
      {/* <pre>{JSON.stringify(ticket, null, 4)}</pre> */}
    </>
  );
};

export default PaymentBox;
