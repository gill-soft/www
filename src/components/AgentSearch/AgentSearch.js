import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import styles from "./AgentSearch.module.css";
import { ReactComponent as Search } from "../../images/search.svg";
import { getTicket } from "../../redux/order/orderOperation";
import { fetchTicket } from "../../redux/order/orderActions";

const AgentSearch = React.forwardRef(({ close }, ref) => {
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
  const handleChange = ({ target }) => {
    setValue(target.value);
  };
  const handleClick = () => {
    clearTicket({});
    close();
  };
  return (
    // <IntlProvider locale={locale} messages={messages[locale]}>
    <div className={styles.box} tabIndex="-1" ref={ref}>
      <input className={styles.input} value={value} onChange={handleChange} />
      <Link to={`/agentTicket/${value}`} onClick={handleClick}>
        <Search fill="var(--color-secondary)" />
      </Link>
    </div>
    // </IntlProvider>
  );
});
export default AgentSearch;
