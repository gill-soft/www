import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchForm from "../components/SearchForm/SearchForm";
import styles from "./City.module.css";
import { inputValueFrom, inputValueTo } from "../redux/searchForm/searchFormAction";
import { Link, useParams } from "react-router-dom";
import { getUrl, getUrlCities } from "../services/getUrl";
import { format } from "date-fns";
import { citiesList } from "../assets/cities";

const City = ({ history }) => {
  const lang = useSelector((state) => state.language);
  const to = useSelector((state) => state.searchForm.to);

  const { city } = useParams();
  const dispatch = useDispatch();
  const sityObj = citiesList.find((el) => {
    return (
      el.name.EN === city ||
      el.name.RU === city ||
      el.name.UA === city ||
      el.name.PL === city
    );
  });
  const citiesFrom = citiesList.filter((el) => el.name[lang] !== city);

  useEffect(() => {
    ((value) => dispatch(inputValueTo(value)))({
      text: sityObj.name[lang],
      value: sityObj.id,
    });
    ((value) => dispatch(inputValueFrom(value)))({
      text: "",
      value: "",
    });
  }, [dispatch, lang, sityObj.id, sityObj.name]);

  // ==== смена url при изменении языка ==== //
  useEffect(() => {
    history.replace(`/${getUrl(lang).trim()}/${sityObj.name[lang]}`);
  }, [history, lang, sityObj.name]);

  return (
    <div className={styles.bgnd}>
      <div className="container">
        <div className={styles.formBox}>
          <SearchForm history={history} />
        </div>
        <h1>Маршрути в місто {sityObj.name[lang]} з міст України </h1>
        <ul>
          {citiesFrom.map((el, idx) => (
            <li key={idx}>
              <Link
                className={styles.link}
                to={`/${getUrl(lang).trim()}/${el.name[lang]}/${city}?from=${el.id}&to=${
                  to.value
                }&date=${format(new Date(), "yyyy-MM-dd")}&passengers=1`}
              >
                {el.name[lang]} - {sityObj.name[lang]}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className={styles.cityTitle}> {sityObj.name[lang]}</h2>
        <p className={styles.text}>{sityObj.text[lang]}</p>
        <img src={sityObj.image} alt="pfnjrf"></img>
      </div>
    </div>
  );
};

export default City;
