import React from "react";
import { useSelector } from "react-redux";
import styles from "./Info.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/InfoMassages";

const Info = () => {
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;
  // const locale = "UK";


  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="container">
        <div className={styles.box}>
          <h2 className={styles.title}>
            <FormattedMessage id="title_promo" />
          </h2>
          <h3 className={styles.text}>
            <FormattedMessage id="text_promo" />
            <a href="https://play.google.com/store/apps/details?id=com.veze.gds">VZ. </a>
            <FormattedMessage id="text_promo_b" />
          </h3>
          <ul>
            <li className={styles.listItem}>
              <FormattedMessage id="promoList_1" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="promoList_2" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="promoList_3" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="promoList_4" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="promoList_5" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="promoList_6" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="promoList_7" />
            </li>
          </ul>
        </div>
        <div className={styles.box}>
          <h2 className={styles.title}>
            <FormattedMessage id="title_booking" />
          </h2>
          <h3 className={styles.subtitle}>
            <FormattedMessage id="subtitle_booking" />
          </h3>
          <p className={styles.text}>
            <FormattedMessage id="bookingList" />
          </p>
          <ul>
            <li className={styles.listItem}>
              <FormattedMessage id="bookingList_1" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="bookingList_2" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="bookingList_3" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="bookingList_4" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="bookingList_5" />
            </li>
            <li className={styles.listItem}>
              <FormattedMessage id="bookingList_6" />
            </li>
          </ul>
          <h3 className={styles.subtitle}>
          <FormattedMessage id="subtitle_pay" />
        </h3>
        <p className={styles.text}>
          <FormattedMessage id="text_pay" />
        </p>
        <h3 className={styles.subtitle}>
          <FormattedMessage id="subtitle_print" />
        </h3>
        <p className={styles.text}>
          <FormattedMessage id="text_print" />
        </p>
        <h3 className={styles.subtitle}>
          <FormattedMessage id="subtitle_seat" />
        </h3>
        <p className={styles.text}>
          <FormattedMessage id="text_seat" />
        </p>
        </div>
        <div className={styles.box}>
          <h2 className={styles.title}>
            <FormattedMessage id="title_routs" />
          </h2>
          <h3 className={styles.subtitle}>
            <FormattedMessage id="subtitle_trip" />
          </h3>
          <p className={styles.text}>
            <FormattedMessage id="text_trip" />
          </p>
          <h3 className={styles.subtitle}>
            <FormattedMessage id="subtitle_bus" />
          </h3>
          <p className={styles.text}>
            <FormattedMessage id="text_bus" />
          </p>
          <h3 className={styles.subtitle}>
            <FormattedMessage id="subtitle_pets" />
          </h3>
          <p className={styles.text}>
            <FormattedMessage id="text_pets" />
          </p>

          <h3 className={styles.subtitle}>
            <FormattedMessage id="subtitle_luggage" />
          </h3>
          <p className={styles.text}>
            <FormattedMessage id="text_luggage" />
          </p>
        </div>
        <div className={styles.box}>
          <h3 className={styles.subtitle}><FormattedMessage id="contacts"/>
          </h3>
          <p className={styles.text}><FormattedMessage id="name"/></p>
          <p className={styles.text}><FormattedMessage id="address"/></p>
          <p className={styles.text}><FormattedMessage id="cod"/></p>

        </div>
      </div>
    </IntlProvider>
  );
};

export default Info;
