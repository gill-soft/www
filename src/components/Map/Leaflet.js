import React, { useState, useEffect } from "react";
import { Map, TileLayer, Marker, Tooltip, Polyline } from "react-leaflet";
import L from "leaflet";
import styles from "./Leaflet.module.css";
import iconCircle from "../../images/circle.svg";
import { citiesList, citiesListSecondary } from "../../assets/cities";
import Form from "./Form";
import Markers from "./Markers";
import { useSelector } from "react-redux";

const limeOptions = { color: "#dc0000" };

const Leaflet = () => {
  const lang = useSelector((state) => state.language);
  const [from, setFrom] = useState({});
  const [to, setTo] = useState({});

  const [listCities, setListCities] = useState(citiesList);
  const [polyline, setPolyline] = useState([
    [undefined, undefined],
    [undefined, undefined],
  ]);
  const windowWidth = window.innerWidth;

  useEffect(() => {
    const fromLatlgt = [from.latitude, from.longitude];
    const toLatlgt = [to.latitude, to.longitude];
    const latlgt = [fromLatlgt, toLatlgt];
    setPolyline(latlgt);
  }, [from, to]);

  const iconC = new L.Icon({
    iconUrl: iconCircle,
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
    setTo({});
    const markers = citiesList.filter((city) => city.latitude !== from.latitude);
    setListCities(markers);
  };
  
  const changeCitiesList = ({ zoom }) => {
    const secondary = citiesListSecondary.filter(
      (el) => el.id !== from.id && el.id !== to.id
    );
    const primary = citiesList.filter((el) => el.id !== from.id && el.id !== to.id);
    if (zoom >= 8) setListCities([...primary, ...secondary]);
    if (zoom < 8) setListCities([...primary]);
  };
  return (
    <>
      {/* <div className={styles.container}> */}
      <Form from={from} to={to} />
      <Map
        center={[49.0139, 29.2858]}
        zoom={windowWidth < 768 ? 6 : 7}
        scrollWheelZoom={true}
        onViewportChanged={changeCitiesList}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        />
        {Object.keys(from).length > 0 && (
          <div onClick={handleClickFrom}>
            <Marker
              position={[from.latitude, from.longitude]}
              onclick={handleClickFrom}
              icon={iconC}
              className={styles.marker}
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
          </div>
        )}
        {Object.keys(to).length > 0 && (
          <div onClick={handleClickTo}>
            <Marker
              position={[to.latitude, to.longitude]}
              onclick={handleClickTo}
              icon={iconC}
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
          </div>
        )}

        {listCities.map((el) => (
          <Markers
            key={el.id}
            city={el}
            changeFrom={changeFrom}
            changeTo={changeTo}
            from={from}
            citiesList={listCities}
          />
        ))}
        {!polyline[1].includes(undefined) && !polyline[0].includes(undefined) && (
          <Polyline color={"#febb02"} pathOptions={limeOptions} positions={polyline} />
        )}
      </Map>
      {/* </ div> */}
    </>
  );
};

export default Leaflet;
