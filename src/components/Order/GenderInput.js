import React from "react";
import {useSelector} from 'react-redux'
import styles from "./GenderInput.module.css";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/OrderPageMessanges";


const GenderInput = ({ id, value, changeGender }) => {
  const lang = useSelector(state=> state.language)
  const locale = lang === "UA" ? "UK" : lang;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.genderBox}>
        <p>
          <FormattedMessage id="sex" />
        </p>
        <div className={styles.checkboxBox}>
          <label>
            <input
              className={styles.checkbox}
              type="checkbox"
              name="gender"
              value="m"
              checked={value === "m"}
              onChange={(e) => changeGender(id, e)}
            />
            <FormattedMessage id="man" />
          </label>
          <label>
            <input
              className={styles.checkbox}
              type="checkbox"
              name="gender"
              value="f"
              checked={value === "f"}
              onChange={(e) => changeGender(id, e)}
            />
            <FormattedMessage id="feman" />
          </label>
        </div>
      </div>
    </IntlProvider>
  );
};

export default GenderInput;
