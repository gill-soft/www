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
    this.setState((prev) => ({
      [el]: { ...prev[`${el}`], [`${target.name}`]: target.value },
    }));
  };
  handleChangeEmail = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };
  handleClick = () => {
    const num = this.props.amountPassangers.length + 1;
    const arr = [...this.props.amountPassangers, `passanger${num}`];
    this.props.fetchAmountPassanger(arr);
  };

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
        <form onSubmit={this.handleSubmit}>
          {this.props.amountPassangers.map((el, idx) => {
            return (
              <div key={idx}>
                <p>Пассажир {idx + 1}</p>
                <input
                  name={`name`}
                  value={this.state.el}
                  onChange={(e) => this.handleChange(el, e)}
                  placeholder="name"
                />
                <input
                  name={`phone`}
                  value={this.state.el}
                  onChange={(e) => this.handleChange(el, e)}
                  placeholder="phone"
                />
                <br />
              </div>
            );
          })}
          <button type="button" onClick={this.handleClick}>
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
