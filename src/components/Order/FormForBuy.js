import React, { Component } from "react";
import { connect } from "react-redux";
import { sendInfoPassanger } from "../../redux/order/orderActions";
import styles from "./FormForBuy.module.css";
import { ReactComponent as Person } from "../../images/person-24px.svg";

class FormForBuy extends Component {
  state = {
    values: [],
    email: "",
  };

  componentDidMount() {
    const { amountPassangers } = this.props;
    for (let i = 1; i <= amountPassangers; i++) {
      this.setState((prev) => ({
        values: [...prev.values, { name: "", phone: "", id: `passanger_${i}` }],
      }));
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
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
  };
  handleAdd = () => {
    if (this.state.values.length >= 10) return;
    const num = +this.state.values.slice(-1)[0].id.split("_")[1] + 1;
    this.setState((prev) => ({
      values: [...prev.values, { name: "", phone: "", id: `passanger_${num}` }],
    }));
    this.props.changeAmountPassanger(this.props.total + 1)
  };

  handleRemove = ({ target }) => {
    if (this.state.values.length <= 1) return;
    this.setState((prev) => ({
      values: prev.values.filter((el) => el.id !== target.name),
    }));
    this.props.changeAmountPassanger(this.props.total - 1)

  };
  getValueName = (id) => {
    return this.state.values.find((el) => el.id === id).name;
  };
  getValuePhone = (id) => {
    return this.state.values.find((el) => el.id === id).phone;
  };

  render() {
    return (
      <div className={styles.container}>
        {/* <pre>{JSON.stringify(this.state, null, 4)}</pre> */}
        <h3 className={styles.title}>Данные пассажиров</h3>

        <form onSubmit={this.handleSubmit}>
          {this.state.values.length > 0 &&
            this.state.values.map((el, idx) => {
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
                      name="phone"
                      type="tel"
                      value={this.getValuePhone(el.id)}
                      onChange={(e) => this.handleChange(el.id, e)}
                      placeholder="phone"
                      autoComplete="nope"
                      required={true}
                    />
                    <p className={styles.price}>{this.props.price} грн</p>
                    <button
                      className={styles.buttonRemove}
                      type="button"
                      name={el.id}
                      onClick={this.handleRemove}
                    ></button>
                  </div>
                </div>
              );
            })}
          <button className={styles.buttonAdd} type="button" onClick={this.handleAdd}>
            Добавить пассажира
          </button>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="email"
            autoComplete="nope"
            onChange={this.handleChangeEmail}
            required={true}
          />
          <button className={styles.buttonBuy} type="submit">
            Перейти к оплате
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
  price: state.order.order.price,
});
const mapDispatchToProps = (dispatch) => ({
  sendInfoPassanger: (val) => dispatch(sendInfoPassanger(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormForBuy);
