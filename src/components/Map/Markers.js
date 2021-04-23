import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import iconBlue from "../../images/adjust_blue.svg";
import iconCircle from "../../images/circle.svg";
import { citiesList } from "../../assets/cities";
import styles from "./Leaflet.module.css";

const Markers = ({ city, history, changeFrom, list, from, changeTo }) => {
  const [isChoose, setIsChoose] = useState(false);
  const lang = useSelector((state) => state.language);
  const [hover, setHover] = useState(false);

  const iconB = new L.Icon({
    iconUrl: iconBlue,
    iconSize: new L.Point(20, 20),
    className: "location-icon",
  });
  const iconC = new L.Icon({
    iconUrl: iconCircle,
    iconSize: new L.Point(20, 20),
    className: "location-icon",
  });

  const handleClick = () => {
    const lat = city.latitude;
    let citieslist = [];
    if (Object.keys(from).length <= 0) {
      citieslist = citiesList.filter((city) => city.latitude !== lat);
    } else {
      citieslist = citiesList
        .filter((city) => city.latitude !== from.latitude)
        .filter((city) => city.latitude !== lat);
    }
    Object.keys(from).length <= 0
      ? changeFrom(city, citieslist)
      : changeTo(city, citieslist);
  };
  const handleMouseEnter = () => {
    setHover(!hover);
  };

  return (
    <div
      className={styles.markerw}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseEnter}
      onClick={handleClick}
    >
      <Marker
        position={[city.latitude, city.longitude]}
        onclick={handleClick}
        onmouseover={handleMouseEnter}
        onmouseout={handleMouseEnter}
        icon={hover ? iconC : iconB}
      >
        <Tooltip
          permanent={true}
          direction="right"
          offset={[10, 0]}
          className={!hover ? styles.tooltip: styles.tooltipYellow}
        >
          <p className={styles.text} name={city.latitude}>
            {city.name[lang]}
          </p>
        </Tooltip>
      </Marker>
    </div>
  );
};

export default Markers;
