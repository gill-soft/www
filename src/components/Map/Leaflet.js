import React, { useState, useEffect } from "react";
import { Map, TileLayer, Marker, Tooltip, Polyline } from "react-leaflet";
import L from "leaflet";
import styles from "./Leaflet.module.css";
import iconBlue from "../../images/adjust_blue.svg";
import iconYellow from "../../images/adjust_yellow.svg";
import iconCircle from "../../images/circle.svg";
import { citiesList } from "../../assets/cities";
import Form from "./Form";
import Markers from "./Markers";
import { useSelector } from "react-redux";

const limeOptions = { color: "#dc0000" };

const Leaflet = ({ history }) => {
  const lang = useSelector((state) => state.language);
  const [from, setFrom] = useState({});
  const [to, setTo] = useState({});
  const [listCities, setListCities] = useState(citiesList);
  const [polyline, setPolyline] = useState([
    [undefined, undefined],
    [undefined, undefined],
  ]); 

  useEffect(() => {
    const fromLatlgt = [from.latitude, from.longitude];
    const toLatlgt = [to.latitude, to.longitude];
    const latlgt = [fromLatlgt, toLatlgt];
    setPolyline(latlgt);
  }, [from, to]);

  const iconY = new L.Icon({
    iconUrl: iconYellow,
    iconSize: new L.Point(20, 20),
    className: "location-icon",
  });

  const changeFrom = (city, list) => {
    setListCities(list);
    setFrom(city);
  };
  const changeTo = (city, list) => {
    setListCities(list);
    setTo(city);
  };
  const handleClickFrom = () => {
    setPolyline([
      [undefined, undefined],
      [undefined, undefined],
    ]);
    setFrom({});
    setTo({});
    setListCities(citiesList);
  };
  const handleClickTo = () => {
    // setFrom({});
    setTo({});
    const markers = citiesList.filter((city) => city.latitude !== from.latitude);
    setListCities(markers);
  };

  return (
    <>
      <Form from={from} to={to} />

      <Map center={[48.0139, 29.2858]} zoom={7} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        />
        {Object.keys(from).length > 0 && (
          <Marker
            position={[from.latitude, from.longitude]}
            onclick={handleClickFrom}
            icon={iconY}
          >
            <Tooltip
              permanent={true}
              direction="right"
              offset={[10, 0]}
              className={styles.tooltipYellow}
            >
              <p className={styles.text}>{from.name[lang]}</p>
            </Tooltip>
          </Marker>
        )}
        {Object.keys(to).length > 0 && (
          <Marker
            position={[to.latitude, to.longitude]}
            onclick={handleClickTo}
            icon={iconY}
          >
            <Tooltip
              permanent={true}
              direction="right"
              offset={[10, 0]}
              className={styles.tooltipYellow}
            >
              <p className={styles.text}>{to.name[lang]}</p>
            </Tooltip>
          </Marker>
        )}
        {listCities.map((el) => (
          <Markers
          key={el.id}
            city={el}
            history={history}
            changeFrom={changeFrom}
            changeTo={changeTo}
            from={from}
          />
        ))}
        {!polyline[1].includes(undefined) && !polyline[0].includes(undefined) && (
          <Polyline color={"#febb02"} pathOptions={limeOptions} positions={polyline} />
        )}
      </Map>
    </>
  );
};

export default Leaflet;
