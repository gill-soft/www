import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { getTicket, getWalletAmount } from "../../redux/order/orderSelectors";
import { applyDiscount } from "../../services/api";
import { getLang } from "../../redux/Language/LanguageSelectors";
import styles from "./Discount.module.css";
import { fetchTicket } from "../../redux/order/orderActions";
import LoaderFromLibrary from "react-loader-spinner";

const Discount = ({ addBonus, isBonus }) => {
  const dispatch = useDispatch();
  const ticket = useSelector(getTicket);
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const walletAmount = useSelector(getWalletAmount);
  const setTicketInfo = (data) => dispatch(fetchTicket(data));
  const [isLoader, setIsLoader] = useState(false);
  
  const handleChange = async () => {
    if (!ticket.services.some((el) => el.price.hasOwnProperty("discounts"))) {
      setIsLoader(true);
      try {
        const { data } = await applyDiscount(ticket.orderId);
        setTicketInfo(data);
        addBonus(!isBonus);
        setIsLoader(false);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      addBonus(!isBonus);
    }
  };

  const getAmount = () => {
    const ticketSumm = ticket.services.reduce((acc, el) => {
      return acc + el.price.amount;
    }, 0);
    return ticketSumm <= walletAmount ? ticketSumm : walletAmount;
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {walletAmount !== 0 && (
        <div className={styles.box}>
          <p className={styles.text}>
            <FormattedMessage id="use" />
            <span>
              {getAmount()}
              <small>
                <FormattedMessage id="uah" />
              </small>
            </span>
            <FormattedMessage id="bonuses" />
          </p>
          {isLoader ? (
            <LoaderFromLibrary
              type="Oval"
              color="var(--color-main)"
              height={18}
              width={18}
            />
          ) : (
            <input
              className={styles.input}
              type="checkbox"
              checked={isBonus}
              onChange={handleChange}
            />
          )}
        </div>
      )}
    </IntlProvider>
  );
};

export default Discount;
