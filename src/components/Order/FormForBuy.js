import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAmountPassanger } from "../../redux/order/orderActions";

class FormForBuy extends Component {
  state = {
    values: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };
  handleChange = (el, { target }) => {
    console.log(el);
    this.setState((prev) => ({
      [el]: { ...prev[`${el}`], [`${target.name}`]: target.value },
    }));
  };
  handleChangeEmail = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };
  handleAdd = () => {
    console.log(this.props.amountPassangers.slice(-1).join().slice(-1));
    const num = +this.props.amountPassangers.slice(-1).join().slice(-1) + 1;
    const arr = [...this.props.amountPassangers, `passanger${num}`];
    this.props.fetchAmountPassanger(arr);
  };

  handleRemove = ({ target }) => {
    delete this.state[`${target.name}`];
    const arr = this.props.amountPassangers.filter((el) => el !== target.name);

    this.props.fetchAmountPassanger(arr);
  };
  getValueName = (el) => {
    return this.state[`${el}`]?.name;
  };
  getValuePhone = (el) => {
    return this.state[`${el}`]?.phone;
  };

  render() {
    console.log(this.props.amountPassangers);

    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
        <form onSubmit={this.handleSubmit}>
          {this.props.amountPassangers.map((el, idx) => {
            return (
              <div key={idx}>
                <p>Пассажир {idx + 1}</p>
                <input
                  name="name"
                  value={this.getValueName(el)}
                  onChange={(e) => this.handleChange(el, e)}
                  placeholder="name"
                />
                <input
                  name="phone"
                  value={this.getValuePhone(el)}
                  onChange={(e) => this.handleChange(el, e)}
                  placeholder="phone"
                />
                <button type="button" name={el} onClick={(e) => this.handleRemove(e)}>
                  remove
                </button>
                <br />
              </div>
            );
          })}
          <button type="button" onClick={this.handleAdd}>
            add
          </button>
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={this.handleChangeEmail}
          />
          <button type="submit">Buy</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  amountPassangers: state.order.amountPassangers,
});
const mapDispatchToProps = (dispatch) => ({
  fetchAmountPassanger: (val) => dispatch(fetchAmountPassanger(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormForBuy);
