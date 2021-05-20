import React, { Component } from "react";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import { IntlProvider, FormattedMessage } from "react-intl";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
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

const regexEmail = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/;
const regexText = /^[а-яА-ЯіІїєЄЇa-ża-ŻёЁA-Za-z\d-' ]+$/;
const regexLatin = /^[a-zA-Z\d- ]+$/;

class FormForBuy extends Component {
  state = {
    values: [],
    email: "w@w.cop",
    resp: {},
    isOffer: true,
    isValidPhone: [-1, ""],
    isValidName: [-1, ""],
    isValidSurname: [-1, ""],
    isValidEmail: null,
    goSearch: false,
  };

  componentDidMount() {
    // this.props.stopLoader();
    const { amountPassangers } = this.props;
    for (let i = 0; i <= amountPassangers - 1; i++) {
      this.setState((prev) => ({
        values: [
          ...prev.values,
          {
            name: "ww",
            surname: "ww",
            phone: "+380992222603",
            id: `${i}`,
            email: "",
            patronymic: "",
          },
        ],
      }));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      resp,
      isValidPhone,
      values,
      goSearch,
      isValidName,
      isValidSurname,
      isValidEmail,
    } = this.state;
    const { tripKeys, getError, trips, lang } = this.props;

    // ==== делаем запрос на бронь билета ==== //
    if (prevState.goSearch !== goSearch) {
      //  ==== если все поля валиддные ==== //
      if (
        isValidPhone[0] === -1 &&
        isValidName[0] === -1 &&
        isValidSurname[0] === -1 &&
        isValidEmail === null
      ) {
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
        return;
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
        const primaryPaymentParams = JSON.stringify(
          resp.primaryPaymentParams,
        );
        const secondaryPaymentParams = JSON.stringify(
          resp.secondaryPaymentParams
        );
        const primary = btoa(
          CryptoJS.AES.encrypt(primaryPaymentParams, "KeyVeze").toString()
        );
        const secondary = btoa(
          CryptoJS.AES.encrypt(secondaryPaymentParams, "KeyVeze").toString()
        );
    this.props.fetchTicket({})

        this.props.history.push(`/ticket/${id}/${primary}/${secondary}`);
      }
    }
  }

  sendOrder = (e) => {
    e.preventDefault();
    const { values, goSearch, email } = this.state;
    const { requeredFields, startLoader } = this.props;
    startLoader();

    this.setState({
      isValidName: [-1, ""],
      isValidSurname: [-1, ""],
      isValidPhone: [-1, ""],
      isValidEmail: null,
    });
    // ==== валидация ==== //
    values.forEach((el, idx) => {
      // === name ===
      if (!regexText.test(el.name))
        this.setState({ isValidName: [idx, 'поле не може містити !"№%:?*/{|}<>'] });
      if (requeredFields.includes("ONLY_LATIN") && !regexLatin.test(el.name))
        this.setState({ isValidName: [idx, "лише латинськими літерами"] });
      if (el.name.trim().length < 2)
        this.setState({ isValidName: [idx, "занадто коротке і'мя"] });
      if (!el.name.trim())
        this.setState({ isValidName: [idx, "це поле необхідно заповнити"] });
      // ==== surname ====
      if (!regexText.test(el.surname))
        this.setState({ isValidSurname: [idx, 'поле не може містити !"№%:?*/{|}<>'] });
      if (requeredFields.includes("ONLY_LATIN") && !regexLatin.test(el.surname))
        this.setState({ isValidSurname: [idx, "лише латинськими літерами"] });
      if (el.surname.trim().length < 2)
        this.setState({ isValidSurname: [idx, "занадто коротке прізвище"] });
      if (!el.surname.trim())
        this.setState({ isValidSurname: [idx, "це поле необхідно заповнити"] });
      // ==== phone ====
      if (!isValidPhoneNumber(el.phone)) {
        this.setState({ isValidPhone: [idx, "не коректний номер телефону"] });
      }
    });
    // ==== email ====
    if (!regexEmail.test(email)) this.setState({ isValidEmail: "не коректний email" });
    this.setState({ goSearch: !goSearch });
  };

  // ==== инпут имя, фамилия, отчество ====//
  handleChangeInput = (idx, { target }) => {
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
    this.setState((prev) => {
      const values = prev.values.reduce((arr, el) => {
        arr.push(el.id === idx ? { ...el, phone: val } : el);
        return arr;
      }, []);
      return { ...prev, values, isValidPhone: [-1, ""] };
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

  // ==== добавить пассажира ====//
  handleAdd = () => {
    const id = +this.state.values.slice(-1)[0].id + 1;
    this.setState((prev) => ({
      values: [
        ...prev.values,
        { name: "", surname: "", phone: "", id: `${id}`, email: this.state.email },
      ],
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
    const {
      values,
      email,
      isOffer,
      isValidPhone,
      isValidName,
      isValidSurname,
      isValidEmail,
    } = this.state;
    const { isLoading, lang } = this.props;
    const locale = lang === "UA" ? "UK" : lang;
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
                  </h3>
                  <form>
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
                            <div className={styles.inputBox}>
                              <label className={styles.label} htmlFor="name">
                                І'мя<small>{this.onlyLatin()}</small>
                              </label>
                              <input
                                className={`${styles.input} ${
                                  isValidName[0] === idx ? styles.red : null
                                }`}
                                name="name"
                                type="text"
                                value={this.state.values[idx].name}
                                onChange={(e) => this.handleChangeInput(el.id, e)}
                                autoComplete="nope"
                              />
                              {isValidName[0] === idx && (
                                <p className={styles.redText}>{isValidName[1]}</p>
                              )}
                            </div>

                            <div className={styles.inputBox}>
                              <label className={styles.label} htmlFor="surname">
                                Прізвище<small>{this.onlyLatin()}</small>
                              </label>
                              <input
                                className={`${styles.input} ${
                                  isValidSurname[0] === idx ? styles.red : null
                                }`}
                                name="surname"
                                type="text"
                                value={this.state.values[idx].surname}
                                onChange={(e) => this.handleChangeInput(el.id, e)}
                                autoComplete="nope"
                              />
                              {isValidSurname[0] === idx && (
                                <p className={styles.redText}>{isValidSurname[1]}</p>
                              )}
                            </div>
                            {this.props.requeredFields.includes("PATRONYMIC") && (
                              <div className={styles.inputBox}>
                                <label className={styles.label} htmlFor="patronymic">
                                  Побатькові<small>{this.onlyLatin()}</small>
                                </label>
                                <input
                                  className={`${styles.input} ${
                                    isValidSurname[0] === idx ? styles.red : null
                                  }`}
                                  name="patronymic"
                                  type="text"
                                  value={this.state.values[idx].patronymic}
                                  onChange={(e) => this.handleChangeInput(el.id, e)}
                                  autoComplete="nope"
                                />
                                {isValidSurname[0] === idx && (
                                  <p className={styles.redText}>{isValidSurname[1]}</p>
                                )}
                              </div>
                            )}
                            <div className={styles.inputBox}>
                              <label className={styles.label} htmlFor="phone">
                                Телефон**
                              </label>
                              <PhoneInput
                                className={`${styles.inputPhone} ${
                                  isValidPhone[0] === idx ? styles.red : ""
                                }`}
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry="UA"
                                value={this.state.values[idx].phone}
                                onChange={(val) => this.handleChangePhone(val, el.id)}
                                autoComplete="nope"
                              />
                              {isValidPhone[0] === idx && (
                                <p className={styles.redText}>{isValidPhone[1]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </form>
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
                    type="submit"
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
  fetchTicket:(obj)=>dispatch(fetchTicket(obj))

});

export default connect(mapStateToProps, mapDispatchToProps)(FormForBuy);
