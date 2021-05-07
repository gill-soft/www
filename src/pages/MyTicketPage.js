import React, { Component } from "react";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import { getTicket, getTicketConfirm } from "../redux/order/orderOperation";
import { getTicketPrint, ttt, ttt1, ttt2, ttt3, ttt4, ttt5 } from "../services/api";
import styles from "./MyTicketPage.module.css";
import PassengersData from "../components/TicketContainer/PassengersData";
import TripInfo from "../components/TicketContainer/TripInfo";

class MyTicketPage extends Component {
  state = {
    status: "NEW",
    id: "",
    url: [],
    routs: [],
  };

  //  ==== получаем информацию о билете ==== //
  componentDidMount() {
    // const oid = this.props.match.params.orderId
    // ttt(oid).then(data =>console.log(data));
    // ttt1(oid).then(data =>console.log(data));
    // ttt2().then(data =>console.log(data));
    // ttt3().then(data =>console.log(data));
    // ttt4().then(data =>console.log(data));
    // ttt5().then(data =>console.log(data));


    // fetch("")
    //   .then((response) => response.text())
    //   .then((text) => console.log(text));
    // ==== получаем зашифрованый id === //
    const encryptId = atob(this.props.match.params.orderId);
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVeze").toString(CryptoJS.enc.Utf8);

    this.setState({ id: id });
    //  ==== получаем информацию о билете === //
    this.props.getTicket(id);
  }
  componentDidUpdate(prevProps) {
    const { id } = this.state;
    const { ticket, match } = this.props;
    if (prevProps.ticket !== ticket) {
      if (!Object.keys(ticket).includes("error")) {
        const arr = [];
        for (let [key, values] of Object.entries(ticket.segments)) {
          arr.push({ [key]: values });

          this.setState({
            routs: arr.sort((a, b) => {
              const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
              const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
              return A - B;
            }),
          });
        }
        if (this.props.ticket.services[0].status === "NEW") {
          this.props.getTicketConfirm(id, match.params.payedId);
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
    const { status, id, url, routs } = this.state;

    return (
      <>
        {!Object.keys(this.props.ticket).includes("error") && (
          <div className="bgnd">
            <div className="container">
              <TripInfo routs={routs} />
              <PassengersData />
              {status === "CONFIRM" && (
                <>
                  <h1 className={`${styles.title} ${styles.blue}`}>
                    Оплата прошла Успешно!!!
                  </h1>
                  <p className={styles.text}>
                    Hомер вашего заказа: <span className={styles.blue}>{id}</span>
                  </p>
                  <a className={styles.link} href={url} target="_blank" rel="noreferrer">
                    Cкачать билет
                  </a>
                </>
              )}
              {status === "ERROR" && (
                <>
                  <h1 className={`${styles.title} ${styles.red}`}>
                    При офрормлении билета произошла ошибка!!!
                  </h1>
                  <p className={styles.text}>
                    Свяжитесь со службой поддержки по телефону:{" "}
                    <a href="tel: +1 111 111-11-11" className={styles.red}>
                      +1 111 111-11-11
                    </a>
                  </p>
                  <p className={styles.text}>
                    Hомер вашего заказа <span className={styles.red}>{id}</span>
                  </p>
                </>
              )}
            </div>
            {/* <pre>{JSON.stringify(this.props.data, null, 4)}</pre> */}
            {/* <pre>{JSON.stringify(this.props.ticket, null, 4)}</pre> */}
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  ticket: state.order.ticket,
  lang: state.language,
});

const mapDispatchToProps = (dispatch) => ({
  getTicketConfirm: (id, paramsId) => dispatch(getTicketConfirm(id, paramsId)),
  getTicket: (id) => dispatch(getTicket(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTicketPage);
