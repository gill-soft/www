import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./FormForBuy.module.css";
import { ReactComponent as Person } from "../../images/person-24px.svg";
import { toBook } from "../../services/api";
import { getError, startLoader, stopLoader } from "../../redux/global/globalActions";
import PublickOffer from "../PublickOffer/PublickOffer";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/OrderPageMessanges";

class FormForBuy extends Component {
  state = {
    values: [],
    email: "",
    resp: {},
    isOffer: true,
    isPersonal: true,
  };

  componentDidMount() {
    const { amountPassangers } = this.props;
    for (let i = 0; i <= amountPassangers - 1; i++) {
      this.setState((prev) => ({
        values: [
          ...prev.values,
          { name: "M", phone: "3", id: `${i}`, surname: "surname1", email: "" },
        ],
      }));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.resp !== this.state.resp) {
      this.props.stopLoader();
      this.state.resp.services.forEach((el) => {
        // ==== проверяем на ошибки в статусе ==== //
        if (el.status !== "NEW") {
          this.props.getError(el.error.message);
          return;
        } else {
          this.props.history.push(`/ticket/${this.state.resp.orderId}`);
        }
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.startLoader();
    const { tripKey, price, getError } = this.props;
    const { values } = this.state;

    const requestBody = {};
    requestBody.lang = this.props.lang;
    requestBody.services = values.map((el, idx) => ({
      customer: { id: idx },
      segment: { id: tripKey[0] },
      seat: { id: `0:${idx + 1}` },
      price: { tariff: { id: price } },
    }));
    console.log(requestBody)
    requestBody.customers = { ...values };
    requestBody.currency = "UAH";

    toBook(requestBody)
      .then(({ data }) => this.setState({ resp: data }))
      .catch((err) => getError(err.message));
  };

  handleChange = (idx, { target }) => {
    target.name === "phone"
      ? this.setState((prev) =>
          // eslint-disable-next-line array-callback-return
          prev.values.map((el) => {
            if (el.id === idx) el[`${target.name}`] = target.value.replace(/\D/, "");
          })
        )
      : this.setState((prev) =>
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

  handleAdd = () => {
    const id = +this.state.values.slice(-1)[0].id + 1;
    this.setState((prev) => ({
      values: [
        ...prev.values,
        { name: "", phone: "", id: `${id}`, surname: "", email: this.state.email },
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
  getValueName = (id) => {
    return this.state.values.find((el) => el.id === id).name;
  };
  getValueSurname = (id) => {
    return this.state.values.find((el) => el.id === id).surname;
  };
  getValuePhone = (id) => {
    return this.state.values.find((el) => el.id === id).phone;
  };
  openModal = () => {
    this.setState({ isModal: true });
  };

  closeModal = () => {
    this.setState({ isModal: false });
  };

  render() {
    const { values, email, isModal, isPersonal, isOffer } = this.state;
    const { isLoading, lang } = this.props;
    const locale = lang === "UA" ? "UK" : lang;

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.container}>
          {/* <pre>{JSON.stringify(this.state, null, 4)}</pre> */}

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
                        className={styles.input}
                        name="name"
                        type="text"
                        value={this.getValueName(el.id)}
                        onChange={(e) => this.handleChange(el.id, e)}
                        placeholder="name"
                        autoComplete="off"
                        required={true}
                      />
                      <input
                        className={styles.input}
                        name="surname"
                        type="text"
                        value={this.getValueSurname(el.id)}
                        onChange={(e) => this.handleChange(el.id, e)}
                        placeholder="surname"
                        autoComplete="off"
                        required={true}
                      />
                      <input
                        className={styles.input}
                        name="phone"
                        type="tel"
                        value={this.getValuePhone(el.id)}
                        onChange={(e) => this.handleChange(el.id, e)}
                        placeholder="phone**"
                        autoComplete="nope"
                        required={true}
                      />
                      <p className={styles.price}>{this.props.price} грн</p>
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
              />{" "}
              <p>
                <FormattedMessage id="offer" />
                <span onClick={this.openModal}>
                  <FormattedMessage id="offerSpan" />
                </span>
              </p>
            </div>
            <div className={styles.publicOfferBox}>
              <input
                name="personalData"
                type="checkbox"
                onChange={() => this.setState({ isPersonal: !this.state.isPersonal })}
              />{" "}
              <p>
                <FormattedMessage id="myData" />
                <span onClick={this.openModal}>
                  <FormattedMessage id="myDataSpan" />
                </span>
              </p>
            </div>
            <button
              className={styles.buttonBuy}
              type="submit"
              disabled={isOffer || isPersonal}
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
          {isModal && <Modal onClose={this.closeModal} component={<PublickOffer />} />}
          <pre>{JSON.stringify(this.state.resp, null, 4)}</pre>
        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
  price: state.order.order.priceId,
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
