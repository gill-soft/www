import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messanges } from "../../intl/NavMessanges";
import { getAuthorization } from "../../services/api";
import { Formik, Form, useField } from "formik";
import { ReactComponent as Visibility } from "../../images/visibility.svg";
import * as Yup from "yup";
import s from "./Login.module.css";

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className={s.input} {...field} {...props} />
      {meta.touched && meta.error ? <div className={s.error}>{meta.error}</div> : null}
    </>
  );
};
const LoginPage = () => {
  const [error, setError] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const lang = useSelector((state) => state.language);
  const locale = lang === "UA" ? "UK" : lang;

//   const location = useLocation();

  return (
    <IntlProvider locale={locale} messages={messanges[locale]}>
      <div className={s.container}>
        <Formik
          initialValues={{
            login: "",
            password: "",
          }}
          validationSchema={Yup.object({
            login: Yup.string().required(<FormattedMessage id="required" />),
            password: Yup.string().required(<FormattedMessage id="required" />),
          })}
          onSubmit={async ({ login, password }) => {
            setError(false);
            try {
              const { data } = await getAuthorization(login, password);
              localStorage.setItem("auth", JSON.stringify(data));
            //   history.push("/");
            window.location.reload();
            // exit()
            } catch {
              setError(true);
            }
          }}
        >
          <div className={s.box}>
            <h2 className={s.title}>
              <FormattedMessage id="authorization" />
            </h2>
            <Form>
              <div className={s.inputBox}>
                <MyTextInput
                  label={<FormattedMessage id="login" />}
                  name="login"
                  type="text"
                />
              </div>
              <div className={s.inputBox}>
                <MyTextInput
                  label={<FormattedMessage id="password" />}
                  name="password"
                  type={isShow ? "text" : "password"}
                />
                <Visibility
                  onClick={() => setIsShow(!isShow)}
                  fill="var(--color-secondary)"
                  className={s.icon}
                />
              </div>

              <button className={s.button} type="submit">
                <FormattedMessage id="signIn" />
              </button>
              {error && (
                <p className={s.errorText}>
                  {" "}
                  <FormattedMessage id="errorText" />
                </p>
              )}
            </Form>
          </div>
        </Formik>
      </div>
    </IntlProvider>
  );
};
export default LoginPage;
