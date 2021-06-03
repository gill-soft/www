import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { citiesList, citiesListSecondary } from "../assets/cities";
import { getUrl } from "../services/getUrl";
import styles from "./Cities.module.css";
import Leaflet from "../components/Map/Leaflet";
import CityImage from "../components/CityImage";
// import a2498389 from '../images/cities/2498389.jpg';

const Cities = () => {
  const lang = useSelector((state) => state.language);
  const history = useHistory();
  // ==== смена url при изменении языка ==== //
  useEffect(() => {
    history.replace(`/${getUrl(lang).trim()}`);
  }, [history, lang]);

  return (
    <>
      <Leaflet />
      <div className="container">
        <ul className={styles.list}>
          {citiesList.map((el, idx) => (
            <li key={idx} className={styles.listItem}>
              <Link
                className={styles.link}
                to={`/${getUrl(lang).trim()}/${el.name[lang]}`}
              >
                <div className={styles.overlay}></div>
                <div className={styles.img}>
                  <CityImage id={el.id} />
                </div>
                <p className={styles.name}>{el.name[lang]}</p>
              </Link>
            </li>
          ))}
          {citiesListSecondary.map((el, idx) => (
            <li key={idx} className={styles.listItem}>
              <Link
                className={styles.link}
                to={`/${getUrl(lang).trim()}/${el.name[lang]}`}
              >
                <div className={styles.overlay}></div>
                <div className={styles.img}>
                <CityImage id={el.id} />

                </div>
                <p className={styles.name}>{el.name[lang]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Cities;
