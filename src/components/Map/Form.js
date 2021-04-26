import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

import { Link } from "react-router-dom";
import { getUrl } from "../../services/getUrl";
import styles from "./Leaflet.module.css";
import { setDoubleTrips, setSingleTrips } from "../../redux/trips/tripsActions";

const Form = ({ from, to }) => {
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch()
  const sendSingleTrips =(val)=> dispatch(setSingleTrips(val))
  const sendDoubleTrips =(val)=> dispatch(setDoubleTrips(val))

const handleClick = () => {
  sendSingleTrips([])
  sendDoubleTrips([])
}
  return (
    <div className={styles.formBox}>
      <div className={styles.inputsBox}>
        <div className={styles.input}>
          <p className={styles.label}>Звідки</p>
          <p className={styles.fromTo}>{from?.name?.[lang]}</p>
        </div>
        <div className={styles.input}>
          <p className={styles.label}>Куди</p>
          <p className={styles.fromTo}>{to?.name?.[lang]}</p>
        </div>
      </div>
      <Link
        className={styles.link}
        to={`${getUrl(lang).trim()}/${from?.name?.[lang]}/${to?.name?.[lang]}?from=${
          from?.id
        }&to=${to?.id}&date=${format(new Date(), "yyyy-MM-dd")}&passengers=1`}
      onClick={handleClick}
      >
        пошук
        
      </Link>
    </div>
  );
};

export default Form;
