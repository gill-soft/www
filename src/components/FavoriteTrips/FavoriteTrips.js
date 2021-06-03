import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import styles from "./FavoriteTrips.module.css";
import { getUrl } from "../../services/getUrl";
// import { popular } from "../../assets/popularsRouts";
import { setDoubleTrips, setSingleTrips } from "../../redux/trips/tripsActions";
import { getPopularRouts } from "../../services/api";
import { inputValueDate } from "../../redux/searchForm/searchFormAction";

const FavoriteTrips = () => {
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const sendSingleTrips = (val) => dispatch(setSingleTrips(val));
  const sendDoubleTrips = (val) => dispatch(setDoubleTrips(val));
  const setData = (date) => dispatch(inputValueDate(date));

  const [popularData, setPopularData] = useState({});
  const [popularRouts, setPopularRouts] = useState([]);

  useEffect(() => {
    getPopularRouts()
      .then(({ data }) => {
        setPopularData(data)
        changePopularRouts(data)        
      })
      .catch((err) => console.log(err));
  }, []);
  // useEffect(() => {
  //   if (Object.keys(popularData).length > 0)
      
  // }, [popularData]);
  const changePopularRouts =(data)=>{
    for (let keys of Object.keys(data.segments)) {
      setPopularRouts((prev) => [...prev, keys]);
    }
  }
  const handleClick = (date) => {
    sendSingleTrips([]);
    sendDoubleTrips([]);
    setData(new Date(date));
  };
  const getLocalitiesName = (id) => {
    const parent = popularData.localities[id].parent.id;
    return popularData.localities[parent].name[lang];
  };
  const getLocalitiesId = (id) => {
    return popularData.localities[id].parent.id;
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Популярні маршрути</h2>
      <ul className={styles.list}>
        {popularRouts.map((el, idx) => (
          <li className={styles.item} key={idx}>
            <Link
              className={styles.link}
              to={`${getUrl(lang).trim()}/${getLocalitiesName(
                popularData.segments[el].departure.id
              )}/${getLocalitiesName(
                popularData.segments[el].arrival.id
              )}?from=${getLocalitiesId(
                popularData.segments[el].departure.id
              )}&to=${getLocalitiesId(popularData.segments[el].arrival.id)}&date=${format(
                new Date(popularData.segments[el].departureDate),
                "yyyy-MM-dd"
              )}&passengers=1`}
              onClick={() => handleClick(popularData.segments[el].departureDate)}
            >
              <div>
                <span>{getLocalitiesName(popularData.segments[el].departure.id)}</span>
                <span> - </span>
                <span>{getLocalitiesName(popularData.segments[el].arrival.id)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteTrips;
