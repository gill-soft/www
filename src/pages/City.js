import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchForm from "../components/SearchForm/SearchForm";
import styles from "./City.module.css";
import { inputValueFrom, inputValueTo } from "../redux/searchForm/searchFormAction";
import { Link, useParams } from "react-router-dom";
import { getUrl } from "../services/getUrl";
import { format } from "date-fns";
import CityImage from "../components/CityImage";
import { getPopularRouts } from "../services/api";
import { citiesList, citiesListSecondary } from "../assets/cities";

const City = ({ history }) => {
  const { city } = useParams();
  const lang = useSelector((state) => state.language);
  const to = useSelector((state) => state.searchForm.to);
  const [data, setData] = useState(null);
  const [routs, setRouts] = useState([]);
  const [cityName, setCityName] = useState(city);

  const dispatch = useDispatch();
  // ==== получаем все маршруты ====//
  useEffect(() => {
    getPopularRouts()
      .then(({ data }) => {
        changeData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // ==== фильтруем все маршруты по выбраному городу ==== //
  const changeData = (data) => {
    setData(data);
    const arr = [];
    for (let keys of Object.keys(data.segments)) {
      arr.push(keys);
    }
    setRouts(
      arr.filter(
        (el) =>
          data.localities[data.localities[data.segments[el].arrival.id].parent.id].name[
            lang
          ] === cityName
      )
    );
  };
  // ==== смена url при изменении языка ==== //
  useEffect(() => {
    history.replace(`/${getUrl(lang).trim()}/${cityName}`);
  }, [cityName, history, lang]);

  useEffect(() => {
    if (routs.length > 0) {
      const id = getCityId(routs[0], "arrival");
      const name = data.localities[id].name[lang];
      setCityName(name);
    }
  }, [lang]);

  // const windowWidth = window.innerWidth;

  useEffect(() => {
    if (routs.length > 0) {
      ((value) => dispatch(inputValueTo(value)))({
        text: getCityName(routs[0], "arrival"),
        value: getCityId(routs[0], "arrival"),
        // lang: sityObj.lang,
      });
      ((value) => dispatch(inputValueFrom(value)))({
        text: "",
        value: "",
        lang: "",
      });
    }
  }, [dispatch,  routs]);
  // ==== получае имя населенного пункта ==== //
  const getCityName = (el, key) => {
    const id = data.segments[el][key].id;
    const name = data.localities[data.localities[id].parent.id].name[lang];
    return name;
  };

  // ==== получае id населенного пункта ==== //
  const getCityId = (el, key) => {
    return data.localities[data.segments[el][key].id].parent.id;
  };

  // ==== получае описание населенного пункта ==== //
  const getText = (id) => {
    const arr = [...citiesList, ...citiesListSecondary];
    return arr.find((el) => el.id === id).text[lang];
  };
  // ==== проверяем есть ли город отправления в списке ==== //
  const isCity = (el) => {
    const arr = [...citiesList, citiesListSecondary].reduce((acc, el) => {
      acc.push(el.id);
      return acc;
    }, []);
    return arr.includes(getCityId(el, "departure"));
  };
  return (
    <div className={styles.bgnd}>
      {routs.length > 0 && (
        <div className="container">
          <div className={styles.formBox}>
            <SearchForm history={history} />
          </div>
          <h1 className={styles.title}>Маршрути в місто {cityName} з міст України </h1>
          <ul className={styles.list}>
            {routs.map((el, idx) => (
              <>
                {isCity(el) && (
                  <li key={idx} className={styles.listItem}>
                    <Link
                      className={styles.link}
                      to={`/${getUrl(lang).trim()}/${getCityName(
                        el,
                        "departure"
                      )}/${getCityName(el, "arrival")}?from=${getCityId(
                        el,
                        "departure"
                      )}&to=${getCityId(el, "arrival")}&date=${format(
                        new Date(),
                        "yyyy-MM-dd"
                      )}&passengers=1`}
                    >
                      <div className={styles.overlay}></div>
                      <div className={styles.img}>
                        <CityImage id={getCityId(el, "departure")} />
                      </div>
                      <p className={styles.name}>
                        {getCityName(el, "departure")} - {getCityName(el, "arrival")}
                      </p>
                    </Link>
                  </li>
                )}
              </>
            ))}
          </ul>
          <h2 className={styles.cityTitle}>{cityName}</h2>
          <p className={styles.text}>{getText(getCityId(routs[0], "arrival"))}</p>
          <CityImage id={getCityId(routs[0], "arrival")} />
        </div>
      )}
    </div>
  );
};

export default City;
