import React, { Component } from "react";
import { connect } from "react-redux";
import { getConfirm, getTicket } from "../redux/order/orderOperation";

class MyTicketPage extends Component {
  state = {
    status: "NEW",
  };

  // ==== получаем информацию о билете ==== //
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTicket(id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ticket !== this.props.ticket) {
      if (this.props.ticket.services[0].status === "NEW") {
        this.props.getConfirm(this.props.match.params.id);
      }
      if (this.props.ticket.services[0].status === "CONFIRM") {
        this.setState({ status: "CONFIRM" });
      }
      if (
        this.props.ticket.services[0].status !== "CONFIRM" &&
        this.props.ticket.services[0].status !== "NEW"
      ) {
        this.setState({ status: "ERROR" });
      }
    }
  }

  render() {
    const { status } = this.state;
    return (
      <>
        {status === "CONFIRM" && (
          <>
            <h1 style={{ paddingTop: "70px" }}>Оплата прошла Успешно!!!</h1>
          </>
        )}
        {status === "ERROR" && (
          <>
            <h1 style={{ paddingTop: "70px" }}>
              Что-то пошло не так! Свяжитесь со службой поддержки
            </h1>
          </>
        )}
        <pre>{JSON.stringify(this.props.data, null, 4)}</pre>
        <pre>{JSON.stringify(this.props.ticket, null, 4)}</pre>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  ticket: state.order.ticket,
  lang: state.language,
  price: state.order.order.priceId,
});

const mapDispatchToProps = (dispatch) => ({
  getTicket: (id) => dispatch(getTicket(id)),
  getConfirm: (id) => dispatch(getConfirm(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTicketPage);
