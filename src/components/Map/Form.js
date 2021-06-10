import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessanges";
import { useHistory } from "react-router-dom";
import { getUrl } from "../../services/getUrl";
import styles from "./Leaflet.module.css";
import { setDoubleTrips, setSingleTrips } from "../../redux/trips/tripsActions";

const Form = ({ from, to }) => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  const dispatch = useDispatch();
  const sendSingleTrips = (val) => dispatch(setSingleTrips(val));
  const sendDoubleTrips = (val) => dispatch(setDoubleTrips(val));
  const history = useHistory();
  const handleClick = () => {
    sendSingleTrips([]);
    sendDoubleTrips([]);
    history.push(
      `${getUrl(lang).trim()}/${from?.name?.[lang]}/${to?.name?.[lang]}?from=${
        from?.id
      }&to=${to?.id}&date=${format(new Date(), "yyyy-MM-dd")}&passengers=1`
    );
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>

    <div className={styles.formBox}>
      <div className={styles.inputsBox}>
        <div className={styles.input}>
          <p className={styles.label}><FormattedMessage id="from" /></p>
          <p className={styles.fromTo}>{from?.name?.[lang]}</p>
        </div>
        <div className={styles.input}>
          <p className={styles.label}><FormattedMessage id="to" /></p>
          <p className={styles.fromTo}>{to?.name?.[lang]}</p>
        </div>
      </div>
      <button
        className={styles.link}
        disabled={(Object.keys(from).length > 0 && Object.keys(to).length > 0)}
        // disabled={true}

        onClick={handleClick}
      >
        <FormattedMessage id="searchBtn" />
      </button>
    </div></IntlProvider>
  );
};

export default Form;
