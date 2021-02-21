import React, { Component } from "react";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import { getConfirm, getTicket } from "../redux/order/orderOperation";
import { getTicketPrint } from "../services/api";

class MyTicketPage extends Component {
  state = {
    status: "NEW",
    id: "",
  };

  //  ==== получаем информацию о билете ==== //
  componentDidMount() {
    // ==== получаем зашифрованый id === //
    const encryptId = this.props.location.pathname.split("myTicket/").reverse()[0];
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVezu").toString(CryptoJS.enc.Utf8);
    this.setState({ id: id });
    //  ==== получаем информацию о билете === //
    this.props.getTicket(id);
  }

  componentDidUpdate(prevProps, prevState) {
    const { id } = this.state;

    if (prevProps.ticket !== this.props.ticket) {
      if (this.props.ticket.services[0].status === "NEW") {
        this.props.getConfirm(id);
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
  //  ==== получить билет ====//
  getTicketForPrint = () => {
    const { id } = this.state;
    getTicketPrint(id, "RU").then(console.log);
  };

  render() {
    const { status, id } = this.state;
    return (
      <>
        {status === "CONFIRM" && (
          <>
            <h1 style={{ paddingTop: "70px" }}>Оплата прошла Успешно!!!</h1>
            <p>Hомер вашего заказа: {id}</p>
          </>
        )}
        {status === "ERROR" && (
          <>
            <h1 style={{ paddingTop: "70px" }}>
              Что-то пошло не так! Свяжитесь со службой поддержки по телефону: +1 111
              111-11-11
            </h1>
          </>
        )}
        <button
          type="button"
          onClick={this.getTicketForPrint}
        >
          Скачать билет
        </button>
        {/* <pre>{JSON.stringify(this.props.data, null, 4)}</pre> */}
        {/* <pre>{JSON.stringify(this.props.ticket, null, 4)}</pre> */}
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
