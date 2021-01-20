import React, { Component } from "react";
import { connect } from "react-redux";

class FormForBuy extends Component {
  state = {
    values: [],
  };

  hdls = (e) => {
    e.preventDefault();
    
  };
  handleChange = (el, { target }) => {
    this.setState((prev) => ({ [el]: { ...prev[`${el}`], [`${target.name}`]: target.value } }));
  };
  handleChangeEmail = ({target}) => {
    this.setState({[target.name]: target.value})
  }

  render() {
    // console.log(this.state);
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
        <form onSubmit={this.hdls}>
          {this.props.amountPassangers.map((el, idx) => {
            return (
              <div key={idx}>
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
          <input tepe="email" name="email" onChange={this.handleChangeEmail} />
          <button type="submit">Buy</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  amountPassangers: state.order.amountPassangers,
});

export default connect(mapStateToProps)(FormForBuy);
