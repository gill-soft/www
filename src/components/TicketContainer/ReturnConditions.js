import React from "react";
import { useSelector } from "react-redux";
import styles from "./ReturnConditions.module.css";
import { ReactComponent as Close } from "../../images/clear-black-36dp.svg";
import { getCity } from "../../services/getInfo";

const ReturnConditions = React.forwardRef(({ segments, close }, ref) => {
  const ticket = useSelector((state) => state.order.ticket);
  const lang = useSelector((state) => state.language);

  return (
    <div className={styles.box} ref={ref}>
      <Close fill="var(--color-main)" onClick={close} className={styles.close} />
      {segments.map((el, idx) => (
        <div key={idx}>
          <h5 className={styles.title}>
            {getCity(ticket.segments[el.segment.id].departure.id, ticket, lang)} -{" "}
            {getCity(ticket.segments[el.segment.id].arrival.id, ticket, lang)}
          </h5>
          <ul>
            {el.price.tariff.returnConditions.map((item, idx) => (
              <p key={idx} className={styles.text}>{item.title.EN}</p>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
});

export default ReturnConditions;
