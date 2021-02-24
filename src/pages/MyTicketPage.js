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

  componentDidUpdate(prevProps, prevState) {
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
            this.getURLs(data);
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
  // ==== получаем массив ссылок билетов ==== //
  getURLs = (data) => {
    let base64 = [];
    if (data.documents) {
      base64 = [data.documents[0].base64];
    } else {
      base64 = data.services.map((el) => el.documents[0].base64);
    }
    this.setState({
      url: base64.map((el) => {
        const byteCharacters = atob(el);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const pdf = new Blob([byteArray], { type: "application/pdf" });
        return window.URL.createObjectURL(pdf);
      }),
    });
  };

  render() {
    const { status, id, url } = this.state;
    return (
      <>
        {status === "CONFIRM" && (
          <>
            <h1 className={styles.title}>Оплата прошла Успешно!!!</h1>
            <p className={styles.text}>Hомер вашего заказа</p>
            <p className={styles.id}>{id}</p>
            {url.length > 0 && (
              <>
                <p className={styles.text}>скачать билеты </p>
                <ul className={styles.list}>
                  {url.map((el, idx) => (
                    <li key={idx}>
                      <a
                        className={styles.link}
                        href={el}
                        target="_blank"
                        rel="noreferrer"
                      >
                        пассажир{idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
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
