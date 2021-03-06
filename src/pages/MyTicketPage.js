import React, { Component } from "react";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../intl/TicketPageMessanges";
import { getTicket, getTicketConfirm } from "../redux/order/orderOperation";
import { getTicketPrint } from "../services/api";
import styles from "./MyTicketPage.module.css";
import PassengersData from "../components/TicketContainer/PassengersData";
import TripInfo from "../components/TicketContainer/TripInfo";
import AdditionalServicesData from "../components/TicketContainer/AdditionalServicesData";
import Modal from "@material-ui/core/Modal";
import Success from "../components/MyTicketContainer/Success";
import { getError } from "../redux/global/globalActions";
import { changeError } from "../services/getError";

class MyTicketPage extends Component {
  state = {
    status: "NEW",
    id: "",
    url: [],
    isModal: true,
  };

  //  ==== получаем информацию о билете ==== //
  componentDidMount() {
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
      if (!ticket.hasOwnProperty("error")) {
        if (
          ticket.services.every((el) => el.status === "NEW" || el.status === "DISCOUNT")
          ) {
          this.props.getTicketConfirm(id, match.params.payedId);
        }
        if (ticket.services.every((el) => el.status === "CONFIRM")) {
          this.setState({ status: "CONFIRM" });
          // ==== получаем билеты для печати ==== //
          getTicketPrint(id, this.props.lang)
            .then(({ data }) => {
              this.getPDF(data.documents[0].base64);
            })
            .catch((err) => console.log(err));
        }
        if (
          ticket.services.some(
            (el) =>
              el.status !== "CONFIRM" && el.status !== "NEW" && el.status !== "DISCOUNT"
          )
        ) {
          this.setState({ status: "ERROR" });
        }
      } else {
        const msgErr = changeError(ticket.error.name);
        this.props.getError(msgErr);
      }
    }
  }
  // ==== получаем ссылку на билет ==== //
  getPDF = (data) => {
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

  // ==== закрыть модальное окно ==== //
  toggleModal = () => {
    this.setState((prev) => ({ isModal: !prev.isModal }));
  };
  render() {
    const { status, id, url } = this.state;
    const { ticket, lang, error } = this.props;
    const locale = lang === "UA" ? "UK" : lang;

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        {ticket && !ticket?.hasOwnProperty("error") && (
          <div className="bgnd">
            <div className="container">
              <div className={styles.data}>
                <TripInfo />
                <PassengersData />
                <AdditionalServicesData />
              </div>
              {status === "CONFIRM" && (
                <>
                  <Modal open={this.state.isModal} onClose={this.toggleModal}>
                    <Success url={url} id={id} closeModal={this.toggleModal} />
                  </Modal>
                  {!this.state.isModal && (
                    <div className={styles.data}>
                      <Success
                        url={url}
                        id={id}
                        closeModal={this.toggleModal}
                        isModal={false}
                      />
                    </div>
                  )}
                </>
              )}
              {status === "ERROR" && (
                <>
                  <h1 className={`${styles.title} ${styles.red}`}>
                    <FormattedMessage id="fail" />
                  </h1>
                  <p className={styles.text}>
                    <FormattedMessage id="call" />
                    <a href="tel: +380675092050" className={styles.red}>
                      +38 (067) 509-20-50
                    </a>
                  </p>
                  <p className={styles.text}>
                    <FormattedMessage id="number" />
                    <span className={styles.red}>{id}</span>
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        {error && (
          <>
            <h1 className={`${styles.title} ${styles.red}`}>{error}</h1>
            <p className={styles.text}>
              <FormattedMessage id="call" />
              <a href="tel: +380675092050" className={styles.red}>
                +38 (067) 509-20-50
              </a>
            </p>
            <p className={styles.text}>
              <FormattedMessage id="number" />
              <span className={styles.red}>{id}</span>
            </p>
          </>
        )}
      </IntlProvider>
    );
  }
}
const mapStateToProps = (state) => ({
  ticket: state.order.ticket,
  lang: state.language,
  error: state.global.error,
});

const mapDispatchToProps = {
  getTicketConfirm,
  getTicket,
  getError,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTicketPage);
