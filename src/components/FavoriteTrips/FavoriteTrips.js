import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import styles from "./FavoriteTrips.module.css";
import { inputValueFrom, inputValueTo } from "../../redux/searchForm/searchFormAction";
import { getUrl } from "../../services/getUrl";
import { popular } from "../../assets/popularsRouts";

const FavoriteTrips = () => {
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const setFrom = (value) => dispatch(inputValueFrom(value));
  const setTo = (value) => dispatch(inputValueTo(value));

  const handleClick = (el) => {
    const from = {
      text: el.departure.name[lang],
      value: el.departure.id,
    };
    const to = {
      text: el.arrival.name[lang],
      value: el.arrival.id,
    };
    setFrom(from);
    setTo(to);
  };
  return (
    <div className={styles.container}>
      <h2>Найпопулярніші маршрути</h2>
      <ul className={styles.list}>
        {popular.map((el, idx) => (
          <li className={styles.item} key={idx}>
            <Link
              className={styles.link}
              to={`${getUrl(lang).trim()}/${el.departure.name[lang]}/${el.arrival.name[lang]}?from=${
                el.departure.id
              }&to=${el.arrival.id}&date=${format(
                new Date(),
                "yyyy-MM-dd"
              )}&passengers=1`}
              onClick={(event) => handleClick(el, event)}
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
  );
};

export default FavoriteTrips;
