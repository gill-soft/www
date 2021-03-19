import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { citiesName } from "../assets/citiesName";
import { getUrlCities } from "../services/getUrl";
import styles from "./Cities.module.css";

const Cities = () => {
  const lang = useSelector((state) => state.language);
  return (
    <div className="bgnd">
      <div className="container">
        {citiesName.map((el, idx) => (
          <li key={idx}>
            <Link
              className={styles.link}
              to={`/${getUrlCities(lang).trim()}/${el.name[lang]}`}
            >
              {el.name[lang]}
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Cities;
