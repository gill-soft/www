import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./FormForBuy.module.css";
import { ReactComponent as Person } from "../../images/person-24px.svg";
import { toBookTicket } from "../../services/api";
import { getError, startLoader, stopLoader } from "../../redux/global/globalActions";
import Loader from "../Loader/Loader";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/OrderPageMessanges";
import CryptoJS from "crypto-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Offerta from "../../assets/Oferta_1.pdf";
import Pk from "../../assets/pk_.pdf";

const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/;
const regexText = /^[а-яА-Яa-ża-ŻёЁA-Za-z\d- ]+$/;
const regexLatin = /[a-zA-Z]/;

class FormForBuy extends Component {
  state = {
    values: [],
    email: "w@w.com",
    resp: {},
    isOffer: false,
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
          { name: "M", surname: "surname1", phone: "", id: `${i}`, email: "" },
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
    const { tripKey, priceId } = this.props;

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
        requestBody.lang = this.props.lang;
        requestBody.services = values.map((el, idx) => ({
          customer: { id: idx },
          segment: { id: tripKey },
          seat: { id: `0:${idx + 1}` },
          price: { tariff: { id: priceId } },
        }));
        requestBody.customers = { ...values };
        requestBody.currency = "UAH";
        console.log("zapros");
        // toBookTicket(requestBody)
        //   .then(({ data }) => this.setState({ resp: data }))
        //   .catch((err) => getError(err.message));
        //  .finally(  this.props.stopLoader())
      } else {
        this.props.stopLoader();
        return;
      }
    }
    //  ==== после получения ответа переходим на страницу билета ==== //
    if (prevState.resp !== this.state.resp) {
      this.state.resp.services.forEach((el) => {
        // ==== проверяем на ошибки в статусе ==== //
        if (el.status !== "NEW") {
          this.props.getError(el.error.message);
          return;
        } else {
          const id = btoa(CryptoJS.AES.encrypt(resp.orderId, "KeyVezu").toString());
          const payeeId = btoa(
            CryptoJS.AES.encrypt(resp.additionals.payeeId, "KeyVezu").toString()
          );
          this.props.history.push(`/ticket/${id}/${payeeId}`);
        }
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.startLoader();
    const { values, goSearch, email } = this.state;
    this.setState({
      isValidName: [-1, ""],
      isValidSurname: [-1, ""],
      isValidPhone: [-1, ""],
      isValidEmail: null,
    });
    // ==== валидация ==== //
    values.forEach((el, idx) => {
      if (!regexText.test(el.name))
        this.setState({ isValidName: [idx, 'поле не може містити !"№%:?*/{|}<>'] });
      if (el.name.trim().length < 2)
        this.setState({ isValidName: [idx, "занадто коротке і'мя"] });
      if (!el.name.trim())
        this.setState({ isValidName: [idx, "це поле необхідно заповнити"] });
      if (!regexLatin.test(el.name))
        this.setState({ isValidName: [idx, "лише латинськими літерами"] });

      if (!regexText.test(el.surname))
        this.setState({ isValidSurname: [idx, 'поле не може містити !"№%:?*/{|}<>'] });

      if (el.surname.trim().length < 2)
        this.setState({ isValidSurname: [idx, "занадто коротке прізвище"] });
      if (!el.surname.trim())
        this.setState({ isValidSurname: [idx, "це поле необхідно заповнити"] });

      if (!el.phone || el.phone.length <= 11) {
        this.setState({ isValidPhone: [idx, "не коректний номер телефону"] });
      }
    });

    if (!regexEmail.test(email)) this.setState({ isValidEmail: "не коректний email" });
    this.setState({ goSearch: !goSearch });
  };

  handleChangeInput = (idx, { target }) => {
    this.setState((prev) =>
      // eslint-disable-next-line array-callback-return
      prev.values.map((el) => {
        if (el.id === idx) el[`${target.name}`] = target.value;
      })
    );
  };

  handleChangeEmail = ({ target }) => {
    this.setState({ [target.name]: target.value });
    this.setState((prev) =>
      // eslint-disable-next-line array-callback-return
      prev.values.map((el) => {
        el[`${target.name}`] = target.value;
      })
    );
  };

  handleChangePhone = (val, idx) => {
    this.setState((prev) =>
      // eslint-disable-next-line array-callback-return
      prev.values.map((el) => {
        if (el.id === idx) el["phone"] = val;
      })
    );
  };

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
    return requeredFields.includes("ONLY_LATIN") ? " латинськими літерами" : null;
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
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.container}>
          <h3 className={styles.title}>
            <FormattedMessage id="title" />
          </h3>
          {values.length > 0 && (
            <form onSubmit={this.handleSubmit}>
              {values.map((el, idx) => {
                return (
                  <div className={styles.box} key={idx}>
                    <div className={styles.svgBox}>
                      <Person className={styles.svg} fill="var(--color-secondary)" />
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
                          id="name"
                          value={this.state.values[idx].name}
                          onChange={(e) => this.handleChangeInput(el.id, e)}
                          autoComplete="off"
                        />
                        {isValidName[0] === idx && (
                          <p className={styles.redText}>{isValidName[1]}</p>
                        )}
                      </div>

                      <div className={styles.inputBox}>
                        <label className={styles.label} htmlFor="surname">
                          Прізвище
                        </label>
                        <input
                          className={`${styles.input} ${
                            isValidSurname[0] === idx ? styles.red : null
                          }`}
                          name="surname"
                          type="text"
                          id="surname"
                          value={this.state.values[idx].surname}
                          onChange={(e) => this.handleChangeInput(el.id, e)}
                          autoComplete="off"
                        />
                        {isValidSurname[0] === idx && (
                          <p className={styles.redText}>{isValidSurname[1]}</p>
                        )}
                      </div>

                      <div className={styles.inputBox}>
                        <label className={styles.label} htmlFor="phone">
                          Телефон**
                        </label>
                        <PhoneInput
                          id="phone"
                          className={`${styles.inputPhone} ${
                            isValidPhone[0] === idx ? styles.red : null
                          }`}
                          international
                          countryCallingCodeEditable={false}
                          defaultCountry="UA"
                          value={this.state.values[idx].phone}
                          onChange={(val) => this.handleChangePhone(val, el.id)}
                        />
                        {isValidPhone[0] === idx && (
                          <p className={styles.redText}>{isValidPhone[1]}</p>
                        )}
                      </div>

                      {/* <p className={styles.price}>{this.props.price} грн</p> */}
                    </div>
                  </div>
                );
              })}

              <button
                className={styles.buttonAdd}
                type="button"
                onClick={this.handleAdd}
                disabled={values.length >= 10 ? true : false}
              >
                <FormattedMessage id="buttonAdd" />
              </button>
              <h3 className={styles.customer}>
                <FormattedMessage id="customer" />
              </h3>
              <div className={styles.inputBox}>
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
                {isValidEmail && <p className={styles.redText}>{isValidEmail}</p>}
              </div>
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
              <button className={styles.buttonBuy} type="submit" disabled={isOffer}>
                {isLoading ? <Loader /> : <FormattedMessage id="buy" />}
              </button>
            </form>
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
    );
  }
}

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
  priceId: state.order.order.priceId,
  price: state.order.order.price,
  lang: state.language,
  tripKey: state.order.order.tripKey,
  isLoading: state.global.isLoading,
});
const mapDispatchToProps = (dispatch) => ({
  getError: (error) => dispatch(getError(error)),
  startLoader: () => dispatch(startLoader()),
  stopLoader: () => dispatch(stopLoader()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormForBuy);
