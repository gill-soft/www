import React, { useState, useCallback } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import styles from "./AgentDashboard.module.css";
import { ReactComponent as Search } from "../../images/search.svg";
import { getTicket } from "../../redux/order/orderOperation";
import { fetchTicket } from "../../redux/order/orderActions";
import { getActivOrders, getActivOrdersByPeriod } from "../../services/api";
// import TripInfo from "../TicketContainer/TripInfo";
import AgentOrder from "./AgentOrder";

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
    getActivOrders()
      .then(({ data }) => setOrdersActiv(data))
      .catch((err) => setError(err));
  };
  const searchActivOrdersByPeriod = () => {
    setOrdersActiv([]);
    const start = format(new Date(startDate), "yyyy-MM-dd");
    const end = format(new Date(endDate), "yyyy-MM-dd");
    getActivOrdersByPeriod(start, end)
      .then(({ data }) => setOrdersPeriod(data))
      .catch((err) => setError(err));
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="container">
        {error && <Redirect to="/error" />}
        <div className={styles.box}>
          <p>Знайти замовлення по номеру</p>
          <input className={styles.input} value={value} onChange={handleChange} />
          <Link
            to={`/agentTicket/${value}`}
            onClick={handleClick}
            className={styles.search}
          >
            Пошук
          </Link>
        </div>
        <div className={styles.box}>
          <p>Всі активні замовлення</p>
          <button className={styles.search} onClick={searchActivOrders}>
            Пошук
          </button>
        </div>
        <div className={styles.box}>
          <div className={styles.periodBox}>
            <p>Замовлення за період </p>
            <div className={styles.dateBox}>
              <p>з</p>
              <div className={styles.datePickerBox}>
                <DatePicker
                  dateFormat="dd MMM yyyy"
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
              <p>по</p>
              <div className={styles.datePickerBox}>
                <DatePicker
                  dateFormat="dd MMM yyyy"
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
            Пошук
          </button>
        </div>
        {ordersActiv.length > 0 &&
          ordersActiv.map((order) => <AgentOrder order={order} />)}
        {ordersPeriod.length > 0 &&
          ordersPeriod.map((order) => <AgentOrder order={order} />)}
      </div>
    </IntlProvider>
  );
};

export default AgentDashboard;
