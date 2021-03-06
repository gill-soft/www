import React, { useState, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import LoaderFromLibrary from "react-loader-spinner";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/AgentPageMessage";
import styles from "./SearchBox.module.css";
import { fetchTicket } from "../../redux/order/orderActions";
import { getActivOrders, getActivOrdersByPeriod } from "../../services/api";
// import AgentOrder from "./AgentOrder";
import { dateLocale } from "../../services/dateFormat";
import CryptoJS from "crypto-js";
import AgentOrder from "../AgentPageContainer/AgentOrder";

const SearchBox = () => {
  const dispatch = useDispatch();
  const clearTicket = useCallback(
    (obj) => {
      dispatch(fetchTicket(obj));
    },
    [dispatch]
  );
  const history = useHistory();
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  const [value, setValue] = useState("");
  const [ordersActiv, setOrdersActiv] = useState([]);
  const [ordersPeriod, setOrdersPeriod] = useState([]);
  const [error, setError] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleChange = ({ target }) => {
    setValue(target.value);
  };
  const handleClick = () => {
    clearTicket(null);
    const ticketId = btoa(CryptoJS.AES.encrypt(value, "KeyVeze").toString());
    history.push(`/viewTicket/${value}`);
  };
  const searchActivOrders = () => {
    setOrdersPeriod([]);
    setOrdersActiv([]);
    setIsLoader("active");

    getActivOrders()
      .then(({ data }) => {
        setIsLoader(false);
        setOrdersActiv(data);
      })
      .catch((err) => setError(err));
  };
  const searchActivOrdersByPeriod = () => {
    setIsLoader("period");
    setOrdersActiv([]);
    setOrdersPeriod([]);

    const start = format(new Date(startDate), "yyyy-MM-dd");
    const end = format(new Date(endDate), "yyyy-MM-dd");
    getActivOrdersByPeriod(start, end)
      .then(({ data }) => {
        setIsLoader(false);
        setOrdersPeriod(data);
      })
      .catch((err) => setError(err));
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {error && <Redirect to="/error" />}
      <h2 className={styles.title}>
        <FormattedMessage id="myTickets" />
      </h2>
      <div className={styles.container}>
        <div className={styles.box}>
          <p className={styles.p}>
            <FormattedMessage id="searchActiv" />
          </p>
          <button className={styles.search} onClick={searchActivOrders}>
            {isLoader === "active" ? (
              <LoaderFromLibrary
                type="ThreeDots"
                color="#00BFFF"
                height={12}
                width={16}
              />
            ) : (
              <FormattedMessage id="search" />
            )}
          </button>
        </div>{" "}
        <div className={styles.box}>
          <p className={styles.p}>
            <FormattedMessage id="searchByNumber" />
          </p>
          <div className={styles.periodBox}>
            <input className={styles.input} value={value} onChange={handleChange} />
          </div>
          <button onClick={handleClick} className={styles.search} disabled={!value}>
            <FormattedMessage id="search" />
          </button>
        </div>
        <div className={styles.box}>
          <div className={styles.periodBox}>
            <p className={styles.p}>
              <FormattedMessage id="searchByPeriod" />
            </p>
            <div className={styles.flexPeriod}>
              <div className={styles.dateBox}>
                <p>
                  <FormattedMessage id="from" />
                </p>
                <div className={styles.datePickerBox}>
                  <DatePicker
                    dateFormat="dd MMM yyyy"
                    locale={dateLocale(lang)}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className={styles.datePicker}
                  />
                </div>
              </div>

              <div className={styles.dateBox}>
                <p>
                  <FormattedMessage id="to" />
                </p>
                <div className={styles.datePickerBox}>
                  <DatePicker
                    dateFormat="dd MMM yyyy"
                    locale={dateLocale(lang)}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className={styles.datePicker}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className={styles.search}
            onClick={searchActivOrdersByPeriod}
            disabled={!startDate || !endDate}
          >
            {isLoader === "period" ? (
              <LoaderFromLibrary
                type="ThreeDots"
                color="#00BFFF"
                height={12}
                width={16}
              />
            ) : (
              <FormattedMessage id="search" />
            )}
          </button>
        </div>
        {ordersActiv.length > 0 &&
          ordersActiv.map((order, idx) => (
            <AgentOrder key={idx} order={order}  idx={idx} />
          ))}
        {ordersPeriod.length > 0 &&
          ordersPeriod.map((order, idx) => (
            <AgentOrder key={idx} order={order}  idx={idx} />
          ))}
      </div>
    </IntlProvider>
  );
};

export default SearchBox;
