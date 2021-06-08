import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchForm from "../components/SearchForm/SearchForm";
import styles from "./City.module.css";
import { inputValueTo } from "../redux/searchForm/searchFormAction";
import { Link, useParams } from "react-router-dom";
import { getUrl } from "../services/getUrl";
import { format } from "date-fns";
import CityImage from "../components/CityImage";
import { getPopularRouts } from "../services/api";
import { citiesList, citiesListSecondary } from "../assets/cities";

const City = ({ history }) => {
  const { city } = useParams();
  const lang = useSelector((state) => state.language);
  const [data, setData] = useState(null);
  const [routs, setRouts] = useState([]);
  const [cityObject, setCityObject] = useState(null);
  const dispatch = useDispatch();
  const setInputTo = (obj) => dispatch(inputValueTo(obj));

  // ==== определяем обьект выбраного города ===//
  useEffect(() => {
    setCityObject(
      [...citiesList, ...citiesListSecondary].find((el) => el.name[lang] === city)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cityObject) {
      // ==== получаем все маршруты ====//
      getPopularRouts()
        .then(({ data }) => {
          changeData(data);
        })
        .catch((err) => console.log(err));
      // ==== определяем в форму поиска куда ==== //
      setInputTo({
        text: cityObject.name[lang],
        value: cityObject.id,
        lang: lang,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityObject]);

  // ==== фильтруем все маршруты по выбраному городу ==== //
  const changeData = (data) => {
    setData(data);
    const arr = [];
    for (let keys of Object.keys(data.segments)) {
      arr.push(keys);
    }
    setRouts(
      arr.filter((el) => {
        const arrivalId = data.segments[el].arrival.id;
        const parentId = data.localities[arrivalId].parent.id;
        return data.localities[parentId].name[lang] === cityObject.name[lang];
      })
    );
  };
  // ==== смена url при изменении языка ==== //
  useEffect(() => {
    if (cityObject) history.replace(`/${getUrl(lang).trim()}/${cityObject.name[lang]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ==== получаем имя населенного пункта ==== //
  const getCityName = (el, key) => {
    const id = data.segments[el][key].id;
    const parentId = data.localities[id].parent.id;
    const name = data.localities[parentId].name[lang];
    return name;
  };

  // ==== получае id населенного пункта ==== //
  const getCityId = (el, key) => {
    return data.localities[data.segments[el][key].id].parent.id;
  };

  // ==== проверяем есть ли город отправления в списке ==== //
  const isCity = (el) => {
    return [...citiesList, ...citiesListSecondary].find(
      (item) => item.id === getCityId(el, "departure")
    );
  };

  return (
    <div className={styles.bgnd}>
      {cityObject && (
        <div className="container">
          <div className={styles.formBox}>
            <SearchForm history={history} />
          </div>
          {routs.length > 0 && (
            <>
              <h1 className={styles.title}>
                Маршрути в місто {cityObject.name[lang]} з міст України{" "}
              </h1>
              <ul className={styles.list}>
                {routs.map((el, idx) => (
                  <React.Fragment key={idx}>
                    {isCity(el) && (
                      <li className={styles.listItem}>
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
                  </React.Fragment>
                ))}
              </ul>
            </>
          )}
          <h2 className={styles.cityTitle}>{cityObject.name[lang]}</h2>
          <p className={styles.text}>{cityObject.text[lang]}</p>
          <CityImage id={cityObject.id} />
        </div>
      )}
    </div>
  );
};

export default City;
