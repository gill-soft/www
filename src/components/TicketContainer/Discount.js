import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getTicket, getWalletAmount } from "../../redux/order/orderSelectors";
import { applyDiscount } from "../../services/api";
import { getLang } from "../../redux/Language/LanguageSelectors";
import styles from "./Discount.module.css";
import { fetchTicket } from "../../redux/order/orderActions";

const Discount = ({ addBonus, isBonus }) => {
  const dispatch = useDispatch();
  const ticket = useSelector(getTicket);
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const walletAmount = useSelector(getWalletAmount);
  const setTicketInfo = (data) => dispatch(fetchTicket(data));

  const handleChange = async () => {
    if (!ticket.services.some((el) => el.price.hasOwnProperty("discounts"))) {
      try {
        const { data } = await applyDiscount(ticket.orderId);
        setTicketInfo(data);
        addBonus(!isBonus);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      addBonus(!isBonus);
    }
  };
  return (
    <>
      {walletAmount !== 0 && (
        <div className={styles.box}>
          <p className={styles.text}>використати бонуси ({walletAmount} грн)</p>
          <input
            className={styles.input}
            type="checkbox"
            checked={isBonus}
            onChange={handleChange}
          />
        </div>
      )}
    </>
  );
};

export default Discount;
