import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getDoubleTrips, getSingleTrips } from "../../redux/trips/tripsSelectors";
import DoubleTrips from "./DoubleTrips";
import SortTripsDouble from "./SortTripsDouble";
import SortTripsDoubleMob from "./SotrTripsDoubleMob";
import SortTripsSingle from "./SortTripsSingle";
import SortTripsSingleMob from "./SortTripsSingleMob";
import styles from "./Trips.module.css";
import DateCarousel from "./DateCarousel";
import Scelet from "./Skelet";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TripsPageMessanges";

const windowWidth = window.innerWidth;

const Trips = () => {
  const singleTrips = useSelector((state) => getSingleTrips(state));
  const doubleTrips = useSelector((state) => getDoubleTrips(state));
  const isLoading = useSelector((state) => state.global.isLoading);
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

  const sortTypeSingle = useSelector((state) => state.trips.sortTypeSingle);
  const sortTypeDouble = useSelector((state) => state.trips.sortTypeDouble);
  const location = useLocation();
  const { from, to } = useParams();
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.tripsBox}>
        <h2 className={styles.title}>
          <FormattedMessage id="title" />
          <br /> {from} - {to}
        </h2>
        <DateCarousel />
        {isLoading && <Scelet />}

        {singleTrips.length > 0 && (
          <>
            {windowWidth >= 768 ? <SortTripsSingle /> : <SortTripsSingleMob />}
            {singleTrips.map((el, idx) => (
              <DoubleTrips key={idx} tripKeys={el.id} location={location} />
            ))}
          </>
        )}
        {doubleTrips.length > 0 && (
          <>
            <h3 className={styles.titleDouble}>Рейси з пересадкою</h3>
            {windowWidth >= 768 ? <SortTripsDouble /> : <SortTripsDoubleMob />}
            {doubleTrips.map((el, idx) => (
              <DoubleTrips key={idx} tripKeys={el.segments} location={location} />
            ))}
          </>
        )}
      </div>
    </IntlProvider>
  );
};

export default Trips;
