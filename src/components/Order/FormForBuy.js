import React, { Component } from "react";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import { IntlProvider, FormattedMessage } from "react-intl";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import styles from "./FormForBuy.module.css";
import { toBookTicket } from "../../services/api";
import { getError, startLoader, stopLoader } from "../../redux/global/globalActions";
import Loader from "../Loader/Loader";
import { messages } from "../../intl/OrderPageMessanges";
import Offerta from "../../assets/Oferta_VZ.pdf";
import Pk from "../../assets/pk_VZ.pdf";
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
    resp: {},
    isOffer: true,
    validation: [],
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
      if (requeredFields.includes("GENDER")) value.gender = "m";
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
    const { resp, values, validation } = this.state;
    const { tripKeys, getError, trips, lang } = this.props;

    if (prevState.validation !== validation) {
      let isValid;
      validation.forEach((el) => {
        const keys = Object.keys(el);
        return (isValid = keys.every((key) => el[key] === ""));
      });
      //  ==== если все поля валидные ==== //
      if (isValid) {
        // ==== фомируем обьект для запроса ==== //
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
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        this.props.stopLoader();
      }
    }

    //  ==== после получения ответа переходим на страницу билета ==== //
    if (prevState.resp !== resp) {
      console.log("resp", resp);
      // ==== проверяем на ошибки в статусе ==== //
      const status = resp.services.every((el) => el.status === "NEW");
      if (status) {
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

        this.props.history.push(`/ticket/${id}/${primary}/${secondary}`);
      } else {
        this.props.getError("el.error.message");
        return;
      }
    }
  }

  // ==== запускаем лоадер и записываем в стейт валидные поля ==== //
  sendOrder = () => {
    this.props.startLoader();
    this.setState({
      validation: this.setValidation(),
    });
  };

  setValidation = () => {
    const { values } = this.state;
    const { requeredFields } = this.props;
    return values.reduce((arr, el) => {
      const obj = {};
      obj.name = this.getValidText(el, "name");
      obj.surname = this.getValidText(el, "surname");
      obj.phone = !isValidPhoneNumber(el.phone) ? "не коректний номер телефону" : "";
      obj.email = !regexEmail.test(el.email) ? "не коректний email" : "";
      if (requeredFields.includes("PATRONUMIC"))
        obj.patronymic = this.getValidText(el, "patronymic");
      if (requeredFields.includes("DOCUMENT_NUMBER"))
        obj.documentNumber = this.getValidDocument(el.documentNumber);
      if (requeredFields.includes("DOCUMENT_SERIES"))
        obj.documentSeries = this.getValidDocument(el.documentSeries);
      if (requeredFields.includes("BIRTHDAY"))
        obj.birthday = !el.birthday ? "це поле необхідно заповнити" : "";
      arr.push(obj);
      return arr;
    }, []);
  };
  // ==== валидация текстового инпута ==== //
  getValidText = (el, key) => {
    let str;
    if (!el[key].trim()) {
      str = "це поле необхідно заповнити";
    } else if (!regexText.test(el[key])) {
      str = 'поле не може містити #!"№%:?*/{|}<>';
    } else if (
      this.props.requeredFields.includes("ONLY_LATIN") &&
      !regexLatin.test(el[key])
    ) {
      str = "лише латинськими літерами";
    } else if (el[key].trim().length < 2) {
      str = "не менше двох символів";
    } else {
      str = "";
    }
    return str;
  };
  // ==== валидация серии и номера пасспорта ====//
  getValidDocument = (value) => {
    let str;
    if (!value.trim()) {
      str = "це поле необхідно заповнити";
    } else if (!regexText.test(value)) {
      str = 'поле не може містити #!"№%:?*/{|}<>';
    } else {
      str = "";
    }
    return str;
  };

  // ==== инпут имя, фамилия, отчество, пол, email ====//
  handleChangeInput = (idx, { target }) => {
    // ==== убираем предупреждение про невалидный инпут ==== //
    if (this.state.validation.length > 0) {
      this.setState((prev) => {
        if (target.name === "gender") {
          return;
        } else if (target.name === "email") {
          prev.validation.map((el) => (el.email = ""));
        } else {
          if (prev.validation[idx]) prev.validation[idx][target.name] = "";
        }
      });
    }
    // ==== записываем значение инпута в информацию о пассажирах ==== //
    this.setState((prev) => {
      const values = prev.values.reduce((arr, el) => {
        if (target.name === "email") {
          arr.push({ ...el, [target.name]: target.value });
        } else {
          arr.push(el.id === idx ? { ...el, [target.name]: target.value } : el);
        }
        return arr;
      }, []);
      return { ...prev, values };
    });
  };

  // ==== инпут телефон ====//
  handleChangePhone = (val, idx) => {
    if (val === undefined) return;
    // ==== убираем предупреждение про невалидный инпут ==== //
    if (this.state.validation.length > 0) {
      this.setState((prev) => {
        if (prev.validation[idx]) prev.validation[idx].phone = "";
      });
    }
    this.setState((prev) => {
      const values = prev.values.reduce((arr, el) => {
        arr.push(el.id === idx ? { ...el, phone: val } : el);
        return arr;
      }, []);

      return { ...prev, values };
    });
  };

  // ==== инпут дата рождения ==== //
  handleChangeDate = (date, idx) => {
    const formatDate = format(new Date(date), "yyyy-MM-dd");
    if (this.state.validation.length > 0) {
      this.setState((prev) => {
        if (prev.validation[idx]) prev.validation[idx].birthday = "";
      });
    }
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
    const { values } = this.state;
    const { requeredFields } = this.props;
    const id = +values.slice(-1)[0].id + 1;
    const value = {
      name: "",
      surname: "",
      phone: "",
      id: `${id}`,
      email: values[0].email,
    };
    if (requeredFields.includes("PATRONYMIC")) value.patronymic = "";
    if (requeredFields.includes("GENDER")) value.gender = "m";
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
    const { values, isOffer, validation } = this.state;
    const { isLoading, lang, requeredFields } = this.props;
    const locale = lang === "UA" ? "UK" : lang;
    return (
      <>
        {isLoading && <Loader />}
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div className={styles.container}>
            {values.length > 0 && (
              <>
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
                            <span>{idx + 1}</span>
                          </div>
                          <button
                            className={styles.buttonRemove}
                            type="button"
                            name={el.id}
                            onClick={(e) => this.handleRemove(e, idx)}
                            disabled={values.length <= 1 ? true : false}
                          ></button>
                          <div className={styles.inputsContainer}>
                            <div className={styles.textBox}>
                              <TextInput
                                handleChangeInput={this.handleChangeInput}
                                id={el.id}
                                values={values}
                                name="name"
                                idx={idx}
                                isValid={validation}
                                label="Ім'я"
                              />
                              <TextInput
                                handleChangeInput={this.handleChangeInput}
                                id={el.id}
                                values={values}
                                name="surname"
                                idx={idx}
                                isValid={validation}
                                label="Прізвище"
                              />

                              {requeredFields.includes("PATRONYMIC") && (
                                <TextInput
                                  handleChangeInput={this.handleChangeInput}
                                  id={el.id}
                                  values={values}
                                  name="patronymic"
                                  idx={idx}
                                  isValid={validation}
                                  label="Побатькові"
                                />
                              )}
                              <div className={styles.inputBox}>
                                <label className={styles.label} htmlFor="phone">
                                  Телефон**
                                </label>
                                <PhoneInput
                                  className={`${styles.inputPhone} ${
                                    validation[idx]?.phone ? styles.red : ""
                                  }`}
                                  international
                                  countryCallingCodeEditable={false}
                                  defaultCountry="UA"
                                  value={values[idx].phone}
                                  onChange={(val) => this.handleChangePhone(val, el.id)}
                                  autoComplete="nope"
                                />
                                {validation[idx]?.phone && (
                                  <p className={styles.redText}>
                                    {validation[idx]?.phone}
                                  </p>
                                )}
                              </div>
                            </div>

                            {requeredFields.includes("CITIZENSHIP") && (
                              <div className={styles.inputBox}>
                                <label className={styles.label} htmlFor="citizenship">
                                  Громадянство
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
                              </div>
                            )}
                            <div className={styles.documentBox}>
                              {requeredFields.includes("DOCUMENT_TYPE") && (
                                <div className={styles.documentType}>
                                  <label className={styles.label} htmlFor="documentType">
                                    Документ
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
                                </div>
                              )}
                              {requeredFields.includes("DOCUMENT_NUMBER") && (
                                <div className={styles.seriesNumber}>
                                  <div className={styles.documentSeries}>
                                    <label
                                      className={styles.label}
                                      htmlFor="documentSeries"
                                    >
                                      Серия
                                    </label>
                                    <input
                                      className={`${styles.input} ${
                                        validation[idx]?.documentSeries
                                          ? styles.red
                                          : null
                                      }`}
                                      name="documentSeries"
                                      type="text"
                                      value={values[idx].documentSeries}
                                      onChange={(e) => this.handleChangeInput(el.id, e)}
                                      autoComplete="nope"
                                    />
                                    {(validation[idx]?.documentSeries ||
                                      validation[idx]?.documentNumber) && (
                                      <p className={styles.redText}>
                                        {validation[idx]?.documentSeries ||
                                          validation[idx]?.documentNumber}
                                      </p>
                                    )}
                                  </div>
                                  <div className={styles.documentNumber}>
                                    <label
                                      className={styles.label}
                                      htmlFor="documentNumber"
                                    >
                                      Номер
                                    </label>
                                    <input
                                      className={`${styles.input} ${
                                        validation[idx]?.documentNumber
                                          ? styles.red
                                          : null
                                      }`}
                                      name="documentNumber"
                                      type="text"
                                      value={values[idx].documentNumber}
                                      onChange={(e) => this.handleChangeInput(el.id, e)}
                                      autoComplete="nope"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className={styles.birthdayGender}>
                              {requeredFields.includes("BIRTHDAY") && (
                                <div className={styles.birthday}>
                                  <label className={styles.label}>Дата народження</label>
                                  <DatePicker
                                    className={`${styles.input} ${styles.inputBirthday} ${
                                      validation[idx]?.birthday ? styles.red : null
                                    }`}
                                    selected={new Date(values[idx].birthday)}
                                    dateFormat="dd MMMM yyyy"
                                    locale={dateLocale(lang)}
                                    peekNextMonth
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    onChange={(date) =>
                                      this.handleChangeDate(date, el.id)
                                    }
                                  />
                                  {validation[idx]?.birthday && (
                                    <p className={styles.redText}>
                                      {validation[idx]?.birthday}{" "}
                                    </p>
                                  )}
                                </div>
                              )}
                              {requeredFields.includes("GENDER") && (
                                <GenderInput
                                  id={el.id}
                                  value={values[idx].gender}
                                  changeGender={this.handleChangeInput}
                                />
                              )}
                            </div>
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
                      Email:
                    </label>
                    <input
                      className={`${styles.input} ${styles.inputEmail}
                        ${validation[0]?.email ? styles.red : null}
                        `}
                      name="email"
                      id="email"
                      value={values[0].email}
                      autoComplete="nope"
                      onChange={(e) => this.handleChangeInput(null, e)}
                    />
                  </div>
                  {validation[0]?.email && (
                    <p className={styles.redText}>{validation[0]?.email}</p>
                  )}
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
              </>
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
