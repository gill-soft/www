import React, { Component } from "react";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import { getConfirm, getTicket } from "../redux/order/orderOperation";
import { getTicketPrint } from "../services/api";
import styles from "./MyTicketPage.module.css";
class MyTicketPage extends Component {
  state = {
    status: "NEW",
    id: "",
    url: [],
  };

  //  ==== получаем информацию о билете ==== //
  componentDidMount() {
    // ==== получаем зашифрованый id === //
    const encryptId = atob(this.props.match.params.id);
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVezu").toString(CryptoJS.enc.Utf8);
    this.setState({ id: id });

    //  ==== получаем информацию о билете === //
    this.props.getTicket(id);
  }

  componentDidUpdate(prevProps) {
    const { id } = this.state;

    if (prevProps.ticket !== this.props.ticket) {
      if (this.props.ticket.services[0].status === "NEW") {
        this.props.getConfirm(id);
      }
      if (this.props.ticket.services[0].status === "CONFIRM") {
        this.setState({ status: "CONFIRM" });
        // ==== получаем билеты для печати ==== //
        getTicketPrint(id, this.props.lang)
          .then(({ data }) => {
            this.getURL(data.documents[0].base64);
          })
          .catch((err) => console.log(err));
      }
      if (
        this.props.ticket.services[0].status !== "CONFIRM" &&
        this.props.ticket.services[0].status !== "NEW"
      ) {
        this.setState({ status: "ERROR" });
      }
    }
  }
  // ==== получаем ссылку на билет ==== //
  getURL = (data) => {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdf = new Blob([byteArray], { type: "application/pdf" });
    const base64 = window.URL.createObjectURL(pdf);
    this.setState({ url: base64 });
  };

  render() {
    const { status, id, url } = this.state;
    return (
      <div className="bgnd">
        
        {status === "CONFIRM" && (
          <div className="container">
            <h1 className={styles.title}>Оплата прошла Успешно!!!</h1>
            <p className={styles.text}>Hомер вашего заказа</p>
            <p className={styles.id}>{id}</p>
            <a className={styles.link} href={url} target="_blank" rel="noreferrer">
              Cкачать билет
            </a>
          </div>
        )}
        {status === "ERROR" && (
          <>
            <h1>При офрормлении билета произошла ошибка!!!</h1>
            <p className={styles.text}>
              Свяжитесь со службой поддержки по телефону:{" "}
              <a href="tel: +1 111 111-11-11">+1 111 111-11-11</a>
            </p>
            <p className={styles.text}>Hомер вашего заказа</p>
            <p className={styles.id}>{id}</p>
          </>
        )}

        {/* <pre>{JSON.stringify(this.props.data, null, 4)}</pre> */}
        {/* <pre>{JSON.stringify(this.props.ticket, null, 4)}</pre> */}
      </div>
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
