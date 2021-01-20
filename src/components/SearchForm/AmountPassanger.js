import React, { Component } from "react";
import { connect } from "react-redux";
import style from "./AmountPassanger.module.css";
import { inputValueAmountPassangers } from "../../redux/searchForm/searchFormAction";

class AmountPassanger extends Component {
  state = {
    isVisible: false,
  };

  componentDidMount() {
    window.addEventListener("click", this.getVisible);
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.getVisible);
  }

  getVisible = (e) => {
    console.log(e);
    if (e.target.className.split("_")[0] === "AmountPassanger") return;
    this.setState({ isVisible: false });
  };

  handleClick = ({ target }) => {
    target.name === "decrement"
      ? this.props.inputValueAmountPassangers(this.props.amount - 1)
      : this.props.inputValueAmountPassangers(this.props.amount + 1);
  };

  render() {
    return (
      <div className={style.amountPass}>
        <input
          className={style.inpPsng}
          value={this.props.amount}
          autoComplete="off"
          onChange={() => console.log()}
          onClick={() => this.setState({ isVisible: true })}
        />
        {this.state.isVisible && (
          <div className={style.backdrop} onClick={this.handleBackdropClick}>
            <span className={style.modal}></span>
            <button
              type="button"
              name="decrement"
              className={style.modal}
              disabled={this.props.amount <= 1}
              onClick={this.handleClick}
            >
              {" "}
              -
            </button>
            <span className={style.modal}>{this.props.amount}</span>
            <button
              type="button"
              name="increment"
              className={style.modal}
              disabled={this.props.amount >= 10}
              onClick={this.handleClick}
            >
              +
            </button>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  amount: state.searchForm.amountPassanger,
});

const mapDispatchToProps = (dispath) => ({
  inputValueAmountPassangers: (val) => dispath(inputValueAmountPassangers(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AmountPassanger);
