import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchForm from "../components/SearchForm/SearchForm";
import styles from "./City.module.css";
import { inputValueFrom, inputValueTo } from "../redux/searchForm/searchFormAction";
import { Link, useParams } from "react-router-dom";
import { getUrl } from "../services/getUrl";
import { format } from "date-fns";
import { citiesList, citiesListSecondary } from "../assets/cities";

const City = ({ history }) => {
  const lang = useSelector((state) => state.language);
  const to = useSelector((state) => state.searchForm.to);
  const [scroll, setScroll] = useState(false);
  const citieslist = [...citiesList, ...citiesListSecondary];
  const windowWidth = window.innerWidth;

  useEffect(() => {
    window.scrollTo(0, 0)
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleScroll = () => {
    if (windowWidth >= 768 && window.scrollY >= 450) setScroll(true);
    if (windowWidth >= 768 && window.scrollY < 450) setScroll(false);
  };

  const { city } = useParams();
  const dispatch = useDispatch();
  const sityObj = citieslist.find((el) => {
    console.log(el)
    return (
      el.name.EN === city ||
      el.name.RU === city ||
      el.name.UA === city ||
      el.name.PL === city
    );
  });
  const citiesFrom = citieslist.filter((el) => el.name[lang] !== city);

  useEffect(() => {
    ((value) => dispatch(inputValueTo(value)))({
      text: sityObj.name[lang],
      value: sityObj.id,
      lang: sityObj.lang,
    });
    ((value) => dispatch(inputValueFrom(value)))({
      text: "",
      value: "",
      lang: "",
    });
  }, [dispatch, lang, sityObj.id, sityObj.lang, sityObj.name]);

  // ==== смена url при изменении языка ==== //
  useEffect(() => {
    history.replace(`/${getUrl(lang).trim()}/${sityObj.name[lang]}`);
  }, [history, lang, sityObj.name]);

  return (
    <div className={styles.bgnd}>
      <div className="container">
        <div className={styles.formBox}>
          <SearchForm history={history} scroll={scroll} />
        </div>
        <h1 className={styles.title}>
          Маршрути в місто {sityObj.name[lang]} з міст України{" "}
        </h1>
        <ul className={styles.list}>
          {citiesFrom.map((el, idx) => (
            <li key={idx} className={styles.listItem}>
              <Link
                className={styles.link}
                to={`/${getUrl(lang).trim()}/${el.name[lang]}/${city}?from=${el.id}&to=${
                  to.value
                }&date=${format(new Date(), "yyyy-MM-dd")}&passengers=1`}
              >
                <div className={styles.overlay}></div>
                <div className={styles.img}>
                  <img src={el.image} alt={`квитки онлайн в ${el.name.lang}`}></img>
                </div>
                <p className={styles.name}>
                  {el.name[lang]} - {sityObj.name[lang]}
                </p>
                <p className={styles.price}>
                  255 <small>uah</small>
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <h2 className={styles.cityTitle}>{sityObj.name[lang]}</h2>
        <p className={styles.text}>{sityObj.text[lang]}</p>
        <img src={sityObj.image} alt="pfnjrf"></img>
      </div>
    </div>
  );
};

export default City;
