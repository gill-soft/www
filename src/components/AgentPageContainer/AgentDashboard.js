import React, { useState, useCallback } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import LoaderFromLibrary from "react-loader-spinner";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/AgentPageMessage";
import styles from "./AgentDashboard.module.css";
import { fetchTicket } from "../../redux/order/orderActions";
import { getActivOrders, getActivOrdersByPeriod } from "../../services/api";
import AgentOrder from "./AgentOrder";
import { dateLocale } from "../../services/dateFormat";

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const clearTicket = useCallback(
    (obj) => {
      dispatch(fetchTicket(obj));
    },
    [dispatch]
  );
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  const [value, setValue] = useState("");
  const [ordersActiv, setOrdersActiv] = useState([]);
  const [ordersPeriod, setOrdersPeriod] = useState([]);
  const [error, setError] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const handleChange = ({ target }) => {
    setValue(target.value);
  };
  const handleClick = () => {
    clearTicket({});
  };
  const searchActivOrders = () => {
    setOrdersPeriod([]);
    setOrdersActiv([]);
    setIsLoader(true);

    getActivOrders()
      .then(({ data }) => {
        setIsLoader(false);
        setOrdersActiv(data);
      })
      .catch((err) => setError(err));
  };
  const searchActivOrdersByPeriod = () => {
    setIsLoader(true);
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
      <div className="container">
        {error && <Redirect to="/error" />}
        <div className={styles.box}>
          <p>
            <FormattedMessage id="searchByNumber" />
          </p>
          <input className={styles.input} value={value} onChange={handleChange} />
          <Link
            to={`/agentTicket/${value}`}
            onClick={handleClick}
            className={styles.search}
          >
            <FormattedMessage id="search" />
          </Link>
        </div>
        <div className={styles.box}>
          <p>
            <FormattedMessage id="searchActiv" />
          </p>
          <button className={styles.search} onClick={searchActivOrders}>
            <FormattedMessage id="search" />
          </button>
        </div>
        <div className={styles.box}>
          <div className={styles.periodBox}>
            <p>
              <FormattedMessage id="searchByPeriod" />
            </p>
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
          <button className={styles.search} onClick={searchActivOrdersByPeriod}>
            <FormattedMessage id="search" />
          </button>
        </div>
        {ordersActiv.length > 0 &&
          ordersActiv.map((order, idx) => (
            <AgentOrder order={order} key={idx} idx={idx} />
          ))}
        {ordersPeriod.length > 0 &&
          ordersPeriod.map((order, idx) => (
            <AgentOrder order={order} key={idx} idx={idx} />
          ))}
      </div>
      {isLoader && (
        <div className={styles.loader}>
          <LoaderFromLibrary type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      )}
    </IntlProvider>
  );
};

export default AgentDashboard;
