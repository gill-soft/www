import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { citiesName } from "../assets/citiesName";
import { citiesList } from "../assets/cities";
import { getUrlCities } from "../services/getUrl";
import styles from "./Cities.module.css";

const Cities = () => {
  const lang = useSelector((state) => state.language);
  const stops = useSelector((state) => state.global.stops);
  const history = useHistory();
  const [cities, setCities] = useState([]);

  // == получаем все города из стопс (временно)==== \\\\
  useEffect(() => {
    stops.forEach((el) => {
      if (el.type === "LOCALITY") {
        setCities((prev) => [...prev, { name: el.name, id: el.id }]);
      }
    });
  }, [stops]);

  // ==== смена url при изменении языка ==== //
  useEffect(() => {
    history.replace(`/${getUrlCities(lang).trim()}`);
  }, [history, lang]);
  const getImg = (id) => {
    return citiesList.find((el) => el.id === id).image;
  };
  return (
    <div className="bgnd">
      <div className="container">
        <ul className={styles.list}>
          {citiesName.map((el, idx) => (
            <li key={idx} className={styles.listItem}>
              <Link
                className={styles.link}
                to={`/${getUrlCities(lang).trim()}/${el.name[lang]}`}
              >
                    
                <div className={styles.img}>
                  <img
                    src={getImg(el.id)}
                    alt={`квитки онлайн в ${el.name.lang}`}
                  ></img>
                </div>
                <p className={styles.name}>{el.name[lang]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cities;
