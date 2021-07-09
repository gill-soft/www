import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import styles from "./FavoriteTrips.module.css";
import { getUrl } from "../../services/getUrl";
import { popular } from "../../assets/popularRouts";
import { setDoubleTrips, setSingleTrips } from "../../redux/trips/tripsActions";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/HomePageMessages";

const FavoriteTrips2 = () => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

 

 
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.container}>
        <h2 className={styles.title}><FormattedMessage id="popular" /></h2>
        <ul className={styles.list}>
          {popular.map((el, idx) => (
            <li className={styles.item} key={idx}>
              <Link
                className={styles.link}
                to={`${getUrl(lang).trim()}/${el.departure.name[lang]}/${
                  el.arrival.name[lang]
                }?from=${el.departure.id}&to=${el.arrival.id}&date=${format(
                  new Date(),
                  "yyyy-MM-dd"
                )}&passengers=1`}
              >
                <div>
                  <span>{el.departure.name[lang]}</span>
                  <span> - </span>
                  <span>{el.arrival.name[lang]}</span>
                </div>
                <span>{el.price}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </IntlProvider>
  );
};

export default FavoriteTrips2;
