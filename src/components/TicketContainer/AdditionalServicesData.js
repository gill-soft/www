import React from "react";
import { useSelector } from "react-redux";
import { getPrice } from "../../services/getInfo";
import styles from "./AdditionalServicesData.module.css";

const AdditionalServicesData = ({ addServ }) => {
  const ticket = useSelector((state) => state.order.ticket);
  const lang = useSelector((state) => state.language);

  const getPrice = (key) => {
    return ticket.services
      .filter((el) => el?.additionalService?.id === key)
      .reduce((summ, el) => {
        summ += el.price.amount;
        return summ;
      }, 0);
  };
  return (
    <div className={styles.box}>
      <h4 className={styles.title}>Додаткові послуги</h4>
      <div className={styles.flex}>
        {addServ.map((el) => (
          <div key={el} className={styles.item}>
            <p>{ticket.additionalServices[el].name[lang]}: </p>
            <p>
              {getPrice(el)} <small>UAH</small>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalServicesData;
