import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import InputMask from "react-input-mask";
import { Redirect } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import LoaderFromLibrary from "react-loader-spinner";

import { messages } from "../intl/AgentPageMessage";
import { confirmValidation, sendValidation } from "../services/api";
import styles from "./Authorization.module.css";
import { getLang } from "../redux/Language/LanguageSelectors";

const InputMasked = React.forwardRef(({ value, changeInputPhone, mask }, ref) => (
  <InputMask
    ref={ref}
    value={value}
    mask={mask}
    onChange={changeInputPhone}
    className={styles.input}
  />
));

const Authorization = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const lang = useSelector(getLang);
  const locale = lang === "UA" ? "UK" : lang;
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const wrapper = useRef("w");
  const changeInputPhone = ({ target }) => {
    setPhone(target.value.replace(/\D+/g, ""));
  };

  const changeInputCode = ({ target }) => {
    setCode(target.value);
  };
  // ==== отправляем номер телефона длля авторизации ==== //
  const sendPhoneNumber = async () => {
    setIsLoading(true);

    try {
      const { status } = await sendValidation(phone);
      if (status === 200) setIsPhone(true);
      setIsLoading(false);
    } catch (error) {
      setError(error);
    }
  };
  // ==== отправляем код авторизации ==== //
  const sendCodeNumber = async () => {
    setIsLoading(true);

    try {
      const { data } = await confirmValidation(phone, code);
      localStorage.setItem("auth", JSON.stringify( data ));
      window.location.reload();
      setIsLoading(false);
    } catch (error) {
      setError(error);
    }
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {error && <Redirect to={"/error"} />}
      {auth && <Redirect to={"/cabinet"} />}
      <div className={styles.container}>
        {!isPhone ? (
          <div>
            <h2 className={styles.title}>
              <FormattedMessage id="welcome" />
            </h2>
            <p className={styles.text}>
              <FormattedMessage id="start" />
            </p>
            <InputMasked
              ref={wrapper}
              value={phone}
              mask="380 (99) 999-99-99"
              changeInputPhone={changeInputPhone}
              className={styles.input}
            />
            <button
              className={styles.btn}
              onClick={sendPhoneNumber}
              disabled={phone.length !== 12}
            >
              {isLoading ? (
                <LoaderFromLibrary
                  type="ThreeDots"
                  color="var(--color-secondary"
                  height={12}
                  width={16}
                />
              ) : (
                <FormattedMessage id="send" />
              )}
            </button>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>
              <FormattedMessage id="confirm" />
            </h2>
            <p className={styles.text}>
              <FormattedMessage id="sms" />+{phone}
            </p>
            <input className={styles.input} value={code} onChange={changeInputCode} />
            <button className={styles.btn} onClick={sendCodeNumber}>
              {isLoading ? (
                <LoaderFromLibrary
                  type="ThreeDots"
                  color="var(--color-secondary"
                  height={12}
                  width={16}
                />
              ) : (
                <FormattedMessage id="send" />
              )}
            </button>
          </>
        )}
      </div>
    </IntlProvider>
  );
};

export default Authorization;
