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

class FormForBuy extends Component {
  state = {
    values: [],
    email: "w@w.com",
    resp: {},
    isOffer: false,
    isValidPhone: null,
    isValidName: null,
    isValidSurname: null,
    goSearch: false,
  };

  componentDidMount() {
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
    } = this.state;
    const { tripKey, priceId } = this.props;

    if (prevState.goSearch !== goSearch) {
      if (isValidPhone === null && isValidName === null && isValidSurname === null) {
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

        toBookTicket(requestBody)
          .then(({ data }) => this.setState({ resp: data }))
          .catch((err) => getError(err.message));
        // // .finally(stopLoader add....)
      } else {
        return;
      }
    }

    if (prevState.resp !== this.state.resp) {
      // this.props.stopLoader();
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
    // this.props.startLoader();
    const { values, goSearch } = this.state;
    this.setState({ isValidName: null, isValidSurname: null, isValidPhone: null });

    values.forEach((el, idx) => {
      console.log(Date.now())
      if (!el.phone || el.phone.length <= 11) {
        this.setState({ isValidPhone: idx });
      }
      if (!el.name || el.name.length <= 2) {
        this.setState({ isValidName: idx });
      }
      if (!el.surname || el.surname.length <= 2) {
        this.setState({ isValidSurname: idx });
      }
    });
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

  render() {
    const {
      values,
      email,
      isOffer,
      isValidPhone,
      isValidName,
      isValidSurname,
    } = this.state;
    const { isLoading, lang } = this.props;
    const locale = lang === "UA" ? "UK" : lang;
    console.log(this.state);
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.container}>
          <h3 className={styles.title}>
            <FormattedMessage id="title" />
          </h3>

          <form onSubmit={this.handleSubmit}>
            {values.length > 0 &&
              values.map((el, idx) => {
                return (
                  <div className={styles.box} key={idx}>
                    <div className={styles.svgBox}>
                      {" "}
                      <Person className={styles.svg} fill="var(--color-secondary)" />
                      <span>{idx + 1}</span>
                    </div>
                    <div className={styles.inputBox}>
                      <input
                        className={`${styles.input} ${
                          isValidName === idx ? styles.red : null
                        }`}
                        name="name"
                        type="text"
                        value={this.state.values[idx].name}
                        onChange={(e) => this.handleChangeInput(el.id, e)}
                        placeholder="name"
                        autoComplete="off"
                        required={true}
                      />
                      <input
                        className={`${styles.input} ${
                          isValidSurname === idx ? styles.red : null
                        }`}
                        name="surname"
                        type="text"
                        value={this.state.values[idx].surname}
                        onChange={(e) => this.handleChangeInput(el.id, e)}
                        placeholder="surname"
                        autoComplete="off"
                        required={true}
                      />
                      <PhoneInput
                        className={`${styles.inputPhone} ${
                          isValidPhone === idx ? styles.red : null
                        }`}
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="UA"
                        value={this.state.values[idx].phone}
                        onChange={(val) => this.handleChangePhone(val, el.id)}
                      />

                      {/* <p className={styles.price}>{this.props.price} грн</p> */}
                      <button
                        className={styles.buttonRemove}
                        type="button"
                        name={el.id}
                        onClick={this.handleRemove}
                        disabled={values.length <= 1 ? true : false}
                      ></button>
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
            <input
              className={styles.input}
              type="email"
              name="email"
              value={email}
              placeholder="email"
              autoComplete="nope"
              onChange={this.handleChangeEmail}
              required={true}
            />
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
            >
              {isLoading ? <Loader /> : <FormattedMessage id="buy" />}
            </button>
          </form>

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
