import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { citiesName } from "../assets/citiesName";
import { getUrlCities } from "../services/getUrl";
import styles from "./Cities.module.css";

const Cities = () => {
  const lang = useSelector((state) => state.language);
  const history = useHistory();
  useEffect(() => {
    history.replace(`/${getUrlCities(lang).trim()}`);
  }, [history, lang]);
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
