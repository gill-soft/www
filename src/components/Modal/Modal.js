import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import style from "./Modal.module.css";

export default class Modal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  backdropRef = createRef();

  componentDidMount() {
    if (this.props.isGohome) return
    window.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    if (e.code !== "Escape") {
      return;
    }
    this.props.onClose();
  };

  handleBackdropClick = (event) => {
    if (this.props.isGohome) return
    const { current } = this.backdropRef;
    if (current && event.target !== current) return;
    this.props.onClose();
  };

  render() {
    return (
      <>
        <div
          className={style.backdrop}
          ref={this.backdropRef}
          onClick={this.handleBackdropClick}
          role="presentation"
        >
          {this.props.component}
        </div>
      </>
    );
  }
}
