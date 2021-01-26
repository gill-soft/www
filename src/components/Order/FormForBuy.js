import React, { Component } from "react";
import { connect } from "react-redux";
import { sendInfoPassanger } from "../../redux/order/orderActions";
import { inputValueAmountPassangers } from "../../redux/searchForm/searchFormAction";

class FormForBuy extends Component {
  state = {
    values: [],
    email: ''
  };

  componentDidMount() {
    const { amountPassangers } = this.props;
    const arrPass = [];
    for (let i = 1; i <= amountPassangers; i++) {
      arrPass.push(`passanger_${i}`);
      this.setState({ values: arrPass });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { amountPassangers } = this.props;
    if (prevProps.amountPassangers !== this.props.amountPassangers) {
      const arrPass = [];
      for (let i = 1; i <= amountPassangers; i++) {
        arrPass.push(`passanger_${i}`);
        this.setState({ values: arrPass });
      }
    }
  }

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
  handleAdd = () => {
    if(this.state.values.length >=10) return
    const num = +this.state.values.slice(-1)[0].split("_")[1] + 1;
    this.setState((prev) => ({ values: [...prev.values, `passanger_${num}`] }));
  };

  handleRemove = ({ target }) => {
    if(this.state.values.length <=1) return

    delete this.state[`${target.name}`];
    this.setState((prev) => ({ values: prev.values.filter((el) => el !== target.name) }));
  };
  getValueName = (el) => {
    return this.state[`${el}`]?.name;
  };
  getValuePhone = (el) => {
    return this.state[`${el}`]?.phone;
  };

  render() {
    console.log(this.state);

    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
        <form onSubmit={this.handleSubmit}>
          {this.state.values.length > 0 &&
            this.state.values.map((el, idx) => {
              console.log(this.state[`${el}`]?.name);
              return (
                <div key={idx}>
                  <p>Пассажир {idx + 1}</p>
                  <input
                    name="name"
                    value={this.state[`${el}`]?.name}
                    onChange={(e) => this.handleChange(el, e)}
                    placeholder="name"
                  />
                  <input
                    name="phone"
                    value={this.state[`${el}`]?.phone}
                    onChange={(e) => this.handleChange(el, e)}
                    placeholder="phone"
                  />
                  <button type="button" name={el} onClick={this.handleRemove}>
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
  amountPassangers: state.searchForm.amountPassanger,
});
const mapDispatchToProps = (dispatch) => ({
  sendInfoPassanger: (val) => dispatch(sendInfoPassanger(val)),
  inputValueAmountPassangers: (val) => dispatch(inputValueAmountPassangers(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormForBuy);
