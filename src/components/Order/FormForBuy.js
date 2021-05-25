import React, { Component } from "react";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import { IntlProvider, FormattedMessage } from "react-intl";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import styles from "./FormForBuy.module.css";
import { ReactComponent as Person } from "../../images/person-24px.svg";
import { toBookTicket } from "../../services/api";
import { getError, startLoader, stopLoader } from "../../redux/global/globalActions";
import Loader from "../Loader/Loader";
import { messages } from "../../intl/OrderPageMessanges";
import Offerta from "../../assets/Oferta_1.pdf";
import Pk from "../../assets/pk_.pdf";
import AdditionalsServices from "./AdditionalsServices";
import { getPrice } from "../../services/getInfo";
import { fetchTicket } from "../../redux/order/orderActions";
import GenderInput from "./GenderInput";
import TextInput from "./TextInput";
import { citizenship, documentTypes, documentTypesRU } from "../../assets/documentType";
import { dateLocale } from "../../services/dateFormat";

const regexEmail =
  /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/;
const regexText = /^[а-яА-ЯіІїЇєЄa-ża-ŻёЁA-Za-z\d-' ]+$/;
const regexLatin = /^[a-zA-Z\d- ]+$/;

class FormForBuy extends Component {
  state = {
    values: [],
    email: "w@w.cop",
    resp: {},
    isOffer: true,
    isValidEmail: null,
    goSearch: false,
    validName: [],
    validSurname: [],
    validPatronymic: [],
    validPhoneNumber: [],
    isValid: false,
  };

  componentDidMount() {
    // this.props.stopLoader();
    const { amountPassangers, requeredFields } = this.props;
    for (let i = 0; i <= amountPassangers - 1; i++) {
      const value = {
        name: "ww",
        surname: "rr",
        phone: "+380992222603",
        id: `${i}`,
        email: "",
      };
      if (requeredFields.includes("PATRONYMIC")) value.patronymic = "rr";
      if (requeredFields.includes("GENDER")) value.gender = "";
      if (requeredFields.includes("CITIZENSHIP")) value.citizenship = "UA";
      if (requeredFields.includes("DOCUMENT_TYPE")) value.documentType = "PASSPORT";
      if (requeredFields.includes("DOCUMENT_NUMBER")) value.documentNumber = "";
      if (requeredFields.includes("DOCUMENT_SERIES")) value.documentSeries = "";
      if (requeredFields.includes("BIRTHDAY")) value.birthday = null;

      this.setState((prev) => ({
        values: [...prev.values, value],
      }));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { resp, values, goSearch } = this.state;
    const { tripKeys, getError, trips, lang } = this.props;

    // ==== делаем запрос на бронь билета ==== //
    if (prevState.goSearch !== goSearch) {
      //  ==== если все поля валиддные ==== //
      let valid = false;
      if (!valid) valid = this.isValid(this.state.validName);
      if (!valid) valid = this.isValid(this.state.validSurname);
      if (!valid) valid = this.isValid(this.state.validPhoneNumber);
      if (!valid) valid = this.isValid(this.state.validPatronymic);
      if (!valid && !this.state.isValidEmail) {
        const requestBody = {};
        requestBody.lang = lang;
        const services = values
          .map((el, idx) =>
            tripKeys.map((key) => ({
              customer: { id: `${idx}` },
              segment: { id: key },
              seat: { id: `0:${idx + 1}` },
              price: { tariff: { id: `${trips.segments[key].price.tariff.id}` } },
            }))
          )
          .flat();
        const additionalServices = this.props.additionalServicesKeys.map((key) => ({
          additionalService: {
            id: key,
          },
          customer: {
            id: "0",
          },
        }));
        requestBody.services = [...services, ...additionalServices];
        requestBody.customers = { ...values };
        requestBody.currency = "UAH";
        // ==== бронируем билет ==== //
        toBookTicket(requestBody)
          .then(({ data }) => {
            this.props.stopLoader();
            this.setState({ resp: data });
          })
          .catch((err) => {
            this.props.stopLoader();
            getError(err.message);
          });
      } else {
        this.props.stopLoader();
      }
    }
    //  ==== после получения ответа переходим на страницу билета ==== //
    if (prevState.resp !== resp) {
      // ==== проверяем на ошибки в статусе ==== //
      const status = resp.services.reduce((arr, el) => {
        if (el.status !== "NEW") arr.push(el.status);
        return arr;
      }, []);
      if (status.length > 0) {
        this.props.getError("el.error.message");
        return;
      } else {
        const id = btoa(CryptoJS.AES.encrypt(resp.orderId, "KeyVeze").toString());
        const primaryPaymentParams = JSON.stringify(resp.primaryPaymentParams);
        const secondaryPaymentParams = JSON.stringify(resp.secondaryPaymentParams);
        const primary = btoa(
          CryptoJS.AES.encrypt(primaryPaymentParams, "KeyVeze").toString()
        );
        const secondary = btoa(
          CryptoJS.AES.encrypt(secondaryPaymentParams, "KeyVeze").toString()
        );
        this.props.fetchTicket({});

        // this.props.history.push(`/ticket/${id}/${primary}/${secondary}`);
      }
    }
  }

  // ==== запускаем лоадер и записываем в стейт валидные поля ==== //
  sendOrder = () => {
    const { goSearch } = this.state;
    this.props.startLoader();
    this.setState({
      validName: this.getValidText("name"),
      validSurname: this.getValidText("surname"),
      validPhoneNumber: this.getValidPhone(),
      goSearch: !goSearch,
    });
    if (this.props.requeredFields.includes("PATRONYMIC")) {
      this.setState({ validPatronymic: this.getValidText("patronymic") });
    }
    this.getValidEmail();
  };

  isValid = (arr) => {
    return arr.reduce((bool, el) => {
      if (bool) {
        bool = true;
      } else if (el === "") {
        bool = false;
      } else {
        bool = true;
      }
      return bool;
    }, false);
  };
  // ==== валидация емейла ==== //
  getValidEmail = () => {
    if (!regexEmail.test(this.state.email)) {
      this.setState({ isValid: true, isValidEmail: "не коректний email" });
    } else {
      this.setState({ isValid: false, isValidEmail: null });
    }
  };
  //  ==== валидация телефона ==== //
  getValidPhone = () => {
    return this.state.values.reduce((arr, el, idx) => {
      !isValidPhoneNumber(el.phone)
        ? (arr[idx] = "не коректний номер телефону")
        : (arr[idx] = "");
      return arr;
    }, []);
  };

  // ====валидация имени фамилии отчества=== ||
  getValidText = (type) => {
    return this.state.values.reduce((arr, el, idx) => {
      !el[type].trim() ? (arr[idx] = "це поле необхідно заповнити") : (arr[idx] = "");
      if (!arr[idx]) {
        if (el[type].trim().length < 2) arr[idx] = "не менше двох символів";
        if (
          this.props.requeredFields.includes("ONLY_LATIN") &&
          !regexLatin.test(el[type])
        )
          arr[idx] = "лише латинськими літерами";
        if (!regexText.test(el[type])) arr[idx] = 'поле не може містити #!"№%:?*/{|}<>';
      }
      return arr;
    }, []);
  };
  // ==== инпут имя, фамилия, отчество, пол ====//
  handleChangeInput = (idx, { target }) => {
    // ==== убираем предупреждение про невалидный инпут ==== //
    this.setState((prev) => {
      if (target.name === "name") prev.validName[idx] = "";
      if (target.name === "surname") prev.validSurname[idx] = "";
      if (target.name === "patronymic") prev.validPatronymic[idx] = "";
    });
    // ==== записываем значение инпута в информацию о пассажирах ==== //
    this.setState((prev) => {
      const values = prev.values.reduce((arr, el) => {
        arr.push(el.id === idx ? { ...el, [target.name]: target.value } : el);
        return arr;
      }, []);
      return { ...prev, values };
    });
  };

  // ==== инпут телефон ====//
  handleChangePhone = (val, idx) => {
    if (val === undefined) return;
    // ==== убираем предупреждение про невалидный инпут ==== //
    this.setState((prev) => {
      prev.validPhoneNumber[idx] = "";
    });
    this.setState((prev) => {
      const values = prev.values.reduce((arr, el) => {
        arr.push(el.id === idx ? { ...el, phone: val } : el);
        return arr;
      }, []);

      return { ...prev, values };
    });
  };

  // ==== инпут ємайл ====//
  handleChangeEmail = ({ target }) => {
    this.setState((prev) => {
      const values = prev.values.reduce((arr, el) => {
        arr.push({ ...el, [target.name]: target.value });
        return arr;
      }, []);
      return { ...prev, values, [target.name]: target.value };
    });
  };
  // ==== инпут гражданство ==== //
  handleChangeDate = (date, e, idx) => {
    // console.log(idx);
    // console.log(date);
    const formatDate = format(new Date(date), "yyyy-MM-dd");
    this.setState((prev) => {
      const values = prev.values.reduce((arr, el) => {
        arr.push(el.id === idx ? { ...el, birthday: formatDate } : el);
        return arr;
      }, []);

      return { ...prev, values };
    });
  };

  // ==== добавить пассажира ====//
  handleAdd = () => {
    const { requeredFields } = this.props;
    const id = +this.state.values.slice(-1)[0].id + 1;
    const value = {
      name: "",
      surname: "",
      phone: "",
      id: `${id}`,
      email: this.state.email,
    };
    if (requeredFields.includes("PATRONYMIC")) value.patronymic = "";
    if (requeredFields.includes("GENDER")) value.gender = "";
    if (requeredFields.includes("CITIZENSHIP")) value.citizenship = "UA";
    if (requeredFields.includes("DOCUMENT_TYPE")) value.documentType = "PASSPORT";
    if (requeredFields.includes("DOCUMENT_NUMBER")) value.documentNumber = "";
    if (requeredFields.includes("DOCUMENT_SERIES")) value.documentSeries = "";
    if (requeredFields.includes("BIRTHDAY")) value.birthday = null;

    this.setState((prev) => ({
      values: [...prev.values, value],
    }));
    this.props.changeAmountPassanger(this.props.total + 1);
  };

  // ==== удалить пассажира ==== //
  handleRemove = ({ target }) => {
    this.setState((prev) => ({
      values: prev.values.filter((el) => el.id !== target.name),
    }));
    this.props.changeAmountPassanger(this.props.total - 1);
  };

  // ==== добавить к label текст про латинские буквы ==== //
  onlyLatin = () => {
    const { requeredFields } = this.props;
    // const requeredFields = ["NAME", "ONLY_LATIN"];
    return requeredFields.includes("ONLY_LATIN") ? " (латинськими літерами)" : null;
  };
  getTotalPrice = () => {
    return +this.getTotalPriceTickets() + this.getTotalPriceAdditionals();
  };

  getTotalPriceTickets = () => {
    const { total, tripKeys, trips } = this.props;
    return (total * getPrice(tripKeys, trips)).toFixed(2);
  };
  // ==== подсчитываем общую сумму дополнительных услуг ==== //
  getTotalPriceAdditionals = () => {
    const { additionalServicesKeys, trips } = this.props;
    // if(additionalServicesKeys.length > 0)
    return additionalServicesKeys.reduce((acc, key) => {
      acc += trips.additionalServices[key].price.amount;
      return acc;
    }, 0);
  };

  render() {
    const { values, email, isOffer, isValidEmail } = this.state;
    const { isLoading, lang, requeredFields } = this.props;
    const locale = lang === "UA" ? "UK" : lang;
    console.log(this.state);
    return (
      <>
        {isLoading && <Loader />}
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div className={styles.container}>
            {values.length > 0 && (
              <div>
                <div className={styles.passangersData}>
                  <h3 className={styles.title}>
                    <FormattedMessage id="title" />
                    <small>{this.onlyLatin()}</small>*:
                  </h3>
                  <div>
                    {values.map((el, idx) => {
                      return (
                        <div className={styles.box} key={idx}>
                          <div className={styles.svgBox}>
                            <Person
                              className={styles.svg}
                              fill="var(--color-secondary)"
                            />
                            <span>{idx + 1}</span>
                          </div>
                          <button
                            className={styles.buttonRemove}
                            type="button"
                            name={el.id}
                            onClick={this.handleRemove}
                            disabled={values.length <= 1 ? true : false}
                          ></button>
                          <div className={styles.inputsContainer}>
                            <TextInput
                              handleChangeInput={this.handleChangeInput}
                              id={el.id}
                              values={values}
                              name="name"
                              idx={idx}
                              isValid={this.state.validName}
                              label="Ім'я"
                            />
                            <TextInput
                              handleChangeInput={this.handleChangeInput}
                              id={el.id}
                              values={values}
                              name="surname"
                              idx={idx}
                              isValid={this.state.validSurname}
                              label="Прізвище"
                            />

                            {this.props.requeredFields.includes("PATRONYMIC") && (
                              <TextInput
                                handleChangeInput={this.handleChangeInput}
                                id={el.id}
                                values={values}
                                name="patronymic"
                                idx={idx}
                                isValid={this.state.validPatronymic}
                                label="Побатькові"
                              />
                            )}
                            <div className={styles.inputBox}>
                              <label className={styles.label} htmlFor="phone">
                                Телефон**
                              </label>
                              <PhoneInput
                                className={`${styles.inputPhone} ${
                                  this.state.validPhoneNumber[idx] ? styles.red : ""
                                }`}
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry="UA"
                                value={this.state.values[idx].phone}
                                onChange={(val) => this.handleChangePhone(val, el.id)}
                                autoComplete="nope"
                              />
                              {this.state.validPhoneNumber[idx] && (
                                <p className={styles.redText}>
                                  {this.state.validPhoneNumber[idx]}
                                </p>
                              )}
                            </div>

                            {this.props.requeredFields.includes("CITIZENSHIP") && (
                              <>
                                <label className={styles.label} htmlFor="citizenship">
                                  громадянство
                                </label>
                                <select
                                  className={styles.input}
                                  value={values[idx].citizenship}
                                  name="citizenship"
                                  onChange={(e) => this.handleChangeInput(el.id, e)}
                                >
                                  {citizenship.map((el) => (
                                    <option
                                      key={el.value}
                                      className={styles.option}
                                      value={el.value}
                                    >
                                      {el.name.UA}
                                    </option>
                                  ))}
                                </select>
                              </>
                            )}
                            {this.props.requeredFields.includes("DOCUMENT_TYPE") && (
                              <>
                                <label className={styles.label} htmlFor="documentType">
                                  документ
                                </label>
                                <select
                                  className={styles.input}
                                  value={values[idx].documentType}
                                  name="documentType"
                                  onChange={(e) => this.handleChangeInput(el.id, e)}
                                >
                                  {values[idx].citizenship === "RU"
                                    ? documentTypesRU.map((el) => (
                                        <option
                                          key={el.id}
                                          className={styles.option}
                                          value={el.id}
                                        >
                                          {el.name.RU}
                                        </option>
                                      ))
                                    : documentTypes.map((el) => (
                                        <option
                                          key={el.id}
                                          className={styles.option}
                                          value={el.id}
                                        >
                                          {el.name.RU}
                                        </option>
                                      ))}
                                </select>
                              </>
                            )}
                            {this.props.requeredFields.includes("DOCUMENT_NUMBER") && (
                              <>
                                <div className={styles.inputBox}>
                                  <label
                                    className={styles.label}
                                    htmlFor="documentNumber"
                                  >
                                    Series
                                  </label>
                                  <input
                                    className={styles.input}
                                    name="documentSeries"
                                    type="text"
                                    value={values[idx].documentSeries}
                                    onChange={(e) => this.handleChangeInput(el.id, e)}
                                    autoComplete="nope"
                                  />
                                </div>
                                <div className={styles.inputBox}>
                                  <label
                                    className={styles.label}
                                    htmlFor="documentNumber"
                                  >
                                    nomer
                                  </label>
                                  <input
                                    className={styles.input}
                                    name="documentNumber"
                                    type="text"
                                    value={values[idx].documentNumber}
                                    onChange={(e) => this.handleChangeInput(el.id, e)}
                                    autoComplete="nope"
                                  />
                                </div>
                              </>
                            )}
                            {requeredFields.includes("BIRTHDAY") && (
                              <DatePicker
                                className={styles.input}
                                selected={new Date(values[idx].birthday)}
                                dateFormat="dd MMMM yyyy"
                                locale={dateLocale(lang)}
                                onChange={(date, e) =>
                                  this.handleChangeDate(date, e, el.id)
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            )}
                            {this.props.requeredFields.includes("GENDER") && (
                              <GenderInput
                                id={el.id}
                                values={values[idx].gender}
                                changeGender={this.handleChangeInput}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className={styles.buttonAdd}
                    type="button"
                    onClick={this.handleAdd}
                    disabled={values.length >= 10 ? true : false}
                  >
                    <FormattedMessage id="buttonAdd" />
                  </button>
                </div>
                <AdditionalsServices />
                <div className={styles.passangersData}>
                  <h3 className={styles.title}>
                    <FormattedMessage id="customer" />
                  </h3>
                  <div className={`${styles.inputBox} ${styles.emailBox}`}>
                    <label className={styles.label} htmlFor="email">
                      Email:{" "}
                    </label>
                    <input
                      className={`${styles.input} ${styles.inputEmail} ${
                        isValidEmail ? styles.red : null
                      } `}
                      name="email"
                      id="email"
                      value={email}
                      autoComplete="nope"
                      onChange={this.handleChangeEmail}
                    />
                  </div>
                  {isValidEmail && <p className={styles.redText}>{isValidEmail}</p>}
                </div>
                <div className={styles.passangersData}>
                  <h3 className={styles.title}>Ваше замовлення:</h3>
                  <div className={styles.summBox}>
                    <p>
                      Квитки:
                      <span className={styles.summa}>
                        {this.getTotalPriceTickets()}
                        <small>UAH</small>
                      </span>
                    </p>
                    <p>
                      Додаткові послуги:
                      <span className={styles.summa}>
                        {this.getTotalPriceAdditionals().toFixed(2)}
                        <small>UAH</small>
                      </span>
                    </p>
                  </div>

                  <p className={styles.total}>
                    Всього:
                    <span className={styles.summa}>
                      {this.getTotalPrice().toFixed(2)}
                      <small>UAH</small>
                    </span>
                  </p>
                  <div className={styles.publicOfferBox}>
                    <input
                      name="publicOffer"
                      type="checkbox"
                      onChange={() => this.setState({ isOffer: !this.state.isOffer })}
                    />
                    <p>
                      <FormattedMessage id="offer" />
                      <a href={Offerta} target="_blanc">
                        <FormattedMessage id="offerSpan" />
                      </a>
                      <FormattedMessage id="myData" />
                      <a href={Pk} target="_blanc">
                        <FormattedMessage id="myDataSpan" />
                      </a>
                    </p>
                  </div>
                  <button
                    className={styles.buttonBuy}
                    type="button"
                    disabled={isOffer}
                    onClick={this.sendOrder}
                  >
                    <FormattedMessage id="buy" />
                  </button>
                </div>
              </div>
            )}
            <p className={styles.text}>
              <FormattedMessage id="requared" />
            </p>
            <p className={styles.text}>
              <FormattedMessage id="numTel" />
            </p>
            {/* <pre>{JSON.stringify(this.state.resp, null, 4)}</pre> */}
          </div>
        </IntlProvider>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
  lang: state.language,
  tripKeys: state.order.tripKeys,
  isLoading: state.global.isLoading,
  trips: state.trips.trips,
  additionalServicesKeys: state.order.additionalServicesKeys,
});
const mapDispatchToProps = (dispatch) => ({
  getError: (error) => dispatch(getError(error)),
  startLoader: () => dispatch(startLoader()),
  stopLoader: () => dispatch(stopLoader()),
  fetchTicket: (obj) => dispatch(fetchTicket(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormForBuy);
