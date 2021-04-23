import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { citiesList } from "../assets/cities";
import { getUrl, getUrlCities } from "../services/getUrl";
import ukraineMap from "../images/ukraine-map-coloring-page-min.jpg";
import styles from "./Cities.module.css";
import Leaflet from "../components/Map/Leaflet";

const Cities = () => {
  const lang = useSelector((state) => state.language);
  const history = useHistory();

  // ==== смена url при изменении языка ==== //
  useEffect(() => {
    history.replace(`/${getUrl(lang).trim()}`);
  }, [history, lang]);

  return (<>
     {/* <div className="bgnd"> */}
      <Leaflet history={history} />
    <div className="container">
      <ul className={styles.list}>
        {citiesList.map((el, idx) => (
          <li key={idx} className={styles.listItem}>
            <Link className={styles.link} to={`/${getUrl(lang).trim()}/${el.name[lang]}`}>
              <div className={styles.img}>
                <img src={el.image} alt={`квитки онлайн в ${el.name.lang}`}></img>
              </div>
              <p className={styles.name}>{el.name[lang]}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    {/* </div>  */}
    </>
  );
};

export default Cities;
