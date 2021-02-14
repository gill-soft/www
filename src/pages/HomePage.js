import React from "react";
import styles from "./HomePage.module.css";
import SearchForm from "../components/SearchForm/SearchForm";
import { connect } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
const messages = {
  EN: {
    title: "Bus ticket",
    subtitle: "in Ukraine, Poland, Europe",
    iconItem1: "Low price guarantee",
    iconItem2: "Safe card payment",
    iconItem3: "24/7 customer support",
    iconItem4: "Вiscounts and bonuses",
    iconItem5: "SMS informing",
  },
  RU: {
    title: "Билеты на автобус",
    subtitle: "по Украине, Польше, Европе",
    iconItem1: "Гарантия низкой цены",
    iconItem2: "Безопасная оплата картой",
    iconItem3: "Круглосуточная служба поддержки",
    iconItem4: "Система скидок и бонусов",
    iconItem5: "Смс информирование",
  },
  UK: {
    title: "Квитки на автобус",
    subtitle: "по Україні, Польщі, Європі",
    iconItem1: "Гарантія низької вартості",
    iconItem2: "Безпечна оплата картою",
    iconItem3: "Цілодобова служба підтримки",
    iconItem4: "Система знижок і бонусів",
    iconItem5: "смс інформування",
  },
  PL: {
    title: "Bilety autobusowe",
    subtitle: "na Ukrainie, w Polsce, Europie",
    iconItem1: "Gwarancja niskiej ceny",
    iconItem2: "Bezpieczna płatność kartą",
    iconItem3: "Obsługa klienta 24/7",
    iconItem4: "System rabatów i bonusów",
    iconItem5: "Informowanie SMS",
  },
};

const HomePage = ({ history, lang }) => {
  const locale = lang === "UA" ? "UK" : lang;
  // console.log(messages_en);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.bgnd}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <FormattedMessage id="title" />
          </h1>
          <p className={styles.subtitle}>
            <FormattedMessage id="subtitle" />
          </p>
          <div className={styles.formContainer}>
            <SearchForm history={history} />
          </div>
          <ul className={styles.iconsBox}>
            <li className={`${styles.iconItem} ${styles.iconItem1}`}>
              <p>
                <FormattedMessage id="iconItem1" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem2}`}>
              <p>
                <FormattedMessage id="iconItem2" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem3}`}>
              <p>
                <FormattedMessage id="iconItem3" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem4}`}>
              <p>
                <FormattedMessage id="iconItem4" />
              </p>
            </li>
            <li className={`${styles.iconItem} ${styles.iconItem5}`}>
              <p>
                <FormattedMessage id="iconItem5" />
              </p>
            </li>
          </ul>
        </div>
      </div>
    </IntlProvider>
  );
};
const mapStateToProps = (state) => ({
  lang: state.language,
});

export default connect(mapStateToProps)(HomePage);
