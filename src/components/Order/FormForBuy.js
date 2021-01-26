import React, { Component } from "react";
import { connect } from "react-redux";
import { sendInfoPassanger } from "../../redux/order/orderActions";

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
  };
  handleChange = (idx, { target }) => {
    this.setState((prev) =>
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
  };

  handleRemove = ({ target }) => {
    if (this.state.values.length <= 1) return;
    this.setState((prev) => ({
      values: prev.values.filter((el) => el.id !== target.name),
    }));
  };
  getValueName = (id) => {
    return this.state.values.find((el) => el.id === id).name;
  };
  getValuePhone = (id) => {
    return this.state.values.find((el) => el.id === id).phone;
  };

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
        <form onSubmit={this.handleSubmit}>
          {this.state.values.length > 0 &&
            this.state.values.map((el, idx) => {
              return (
                <div key={idx}>
                  <p>Пассажир {idx + 1}</p>
                  <input
                    name="name"
                    value={this.getValueName(el.id)}
                    onChange={(e) => this.handleChange(el.id, e)}
                    placeholder="name"
                  />
                  <input
                    name="phone"
                    value={this.getValuePhone(el.id)}
                    onChange={(e) => this.handleChange(el.id, e)}
                    placeholder="phone"
                  />
                  <button type="button" name={el.id} onClick={this.handleRemove}>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(FormForBuy);
