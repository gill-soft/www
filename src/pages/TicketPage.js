import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Modal from "../components/Modal/Modal";
import GoHome from "../components/GoHome/GoHome";
import { getTicket } from "../redux/order/orderOperation";
import { getExpireTime } from "../services/getInfo";
import styles from "./TicketPage.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/TicketPageMessanges";
import Timer from "../components/Timer/Timer";

const TicketPage = ({ lang, match, ticket, getTicket }) => {
  const [time, setTime] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const locale = lang === "UA" ? "UK" : lang;
  const tripKey = JSON.parse(localStorage.getItem('tripKey'))

  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    const id = match.params.id;
    getTicket(id);
  }, [match.params.id, getTicket]);

  const getName = (id, type) => {
    return ticket.customers[`${id}`][`${type}`];
  };

  const getTotalPrice = () =>
    ticket.services.reduce((acc, el) => {
      return acc + el.price.amount;
    }, 0);

  const getLocality = (type) => {
    console.log("1", ticket);
    const stopId = ticket.segments[`${tripKey}`][`${type}`].id;
    const id = ticket.localities[`${stopId}`].parent.id;
    return ticket.localities[`${id}`]?.name[`${lang}`];
  };
  const getStop = (type) => {
    const id = ticket.segments[`${tripKey}`][`${type}`].id;
    return ticket.localities[`${id}`].name[`${lang}`];
  };

  return (
    <>
      {Object.keys(ticket).length > 0 && (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div className={styles.bgnd}>
            <div className={styles.container}>
              {Object.keys(ticket).length > 0 && (
                <>
                  <div className={styles.orderBox}>
                    <h4 className={styles.subTitle}>
                      <FormattedMessage id="trip" />
                    </h4>
                    <div className={styles.arrow}>
                      <p className={styles.locality}>{getLocality("departure")}</p>
                      <p className={styles.localityStop}>{getStop("departure")}</p>
                      <p className={styles.date}>
                        {ticket.segments[`${tripKey}`].departureDate}
                      </p>
                    </div>
                    <div>
                      <p className={styles.locality}>{getLocality("arrival")}</p>
                      <p className={styles.localityStop}>{getStop("arrival")}</p>
                      <p className={styles.date}>
                        {ticket.segments[`${tripKey}`].arrivalDate}
                      </p>
                    </div>
                  </div>

                  <div className={styles.passangersBox}>
                    <h4 className={styles.subTitle}>
                      <FormattedMessage id="passangersData" />
                    </h4>
                    <ul>
                      {ticket.services.map((el, idx) => (
                        <li key={idx}>
                          <div className={styles.header}>
                            <p className={styles.number}>
                              <FormattedMessage id="passenger" />
                              {idx + 1}
                            </p>
                            <p className={styles.price}>
                              <span>
                                <FormattedMessage id="cost" />
                              </span>
                              {el.price.amount} UAH
                            </p>
                          </div>
                          <div className={styles.passangerData}>
                            <div>
                              <p className={styles.passangerTitle}>
                                <FormattedMessage id="name" />
                              </p>
                              <p className={styles.passangerName}>
                                {getName(el.customer.id, "name")}
                              </p>
                            </div>
                            <div>
                              <p className={styles.passangerTitle}>
                                <FormattedMessage id="surname" />
                              </p>
                              <p className={styles.passangerName}>
                                {getName(el.customer.id, "surname")}
                              </p>
                            </div>
                            <div>
                              <p className={styles.passangerTitle}>
                                <FormattedMessage id="phone" />
                              </p>
                              <p className={styles.passangerName}>
                                {getName(el.customer.id, "phone")}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.payment}>
                    <div className={styles.warning}>
                      <p className={styles.warningText}>
                        <FormattedMessage id="endTime" />
                        <span>{getExpireTime(ticket.services[0].expire, lang)}</span>
                      </p>
                      <Timer />
                    </div>
                    {/* portmone */}
                    <form action="https://www.portmone.com.ua/gateway/" method="post">
                      <input type="hidden" name="payee_id" value="1185" />
                      <input
                        type="hidden"
                        name="shop_order_number"
                        value={ticket.orderId}
                      />
                      <input type="hidden" name="bill_amount" value={getTotalPrice()} />
                      <input
                        type="hidden"
                        name="description"
                        value={`${getLocality("departure")} - ${getLocality("arrival")} ${
                          ticket.segments[`${tripKey}`].departureDate
                        }`}
                      />
                      <input
                        type="hidden"
                        name="success_url"
                        value="http://example.com/success.html"
                      />
                      <input
                        type="hidden"
                        name="failure_url"
                        value="http://localhost:3000"
                      />
                      <input type="hidden" name="lang" value={lang.toLowerCase()} />
                      <input type="hidden" name="encoding" value="UTF-8" />
                      <input
                        type="hidden"
                        name="exp_time"
                        value={"" + (time / 1000).toFixed()}
                      />
                      <button type="submit">portmone</button>
                    </form>
                    {/* portmone */}

                    {/* {!!isModal && <Modal  component={<GoHome />} isGohome={true}/>} */}
                  </div>
                </>
              )}

              <pre>{JSON.stringify(ticket, null, 4)} </pre>
            </div>
          </div>
        </IntlProvider>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  ticket: state.order.ticket,
  lang: state.language,
  price: state.order.order.priceId,
  // tripKey: state.order.order.tripKey,
});

const mapDispatchToProps = (dispatch) => ({
  getTicket: (id) => dispatch(getTicket(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketPage);
