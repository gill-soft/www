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

class MyTicketPage extends Component {
  state = {
    status: "NEW",
    id: "",
    url: [],
    routs: [],
    additionalServices: [],
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
      if (!Object.keys(ticket).includes("error")) {
        const arr = [];
        for (let [key, values] of Object.entries(ticket.segments)) {
          arr.push({ [key]: values });
        }
        this.setState({
          routs: arr.sort((a, b) => {
            const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
            const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
            return A - B;
          }),
          additionalServices: Array.from(
            new Set(
              ticket.services
                .filter((el) => el.hasOwnProperty("additionalService"))
                .reduce((arr, el) => {
                  arr.push(el.additionalService.id);
                  return arr;
                }, [])
            )
          ),
        });
        if (ticket.services.every((el) => el.status === "NEW")) {
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
          ticket.services.some((el) => el.status !== "CONFIRM") &&
          ticket.services.some((el) => el.status !== "NEW")
        ) {
          this.setState({ status: "ERROR" });
        }
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
  render() {
    const { status, id, url, routs, additionalServices } = this.state;
    const { ticket, lang } = this.props;
    const locale = lang === "UA" ? "UK" : lang;

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        {!Object.keys(ticket).includes("error") && routs.length > 0 && (
          <div className="bgnd">
            <div className="container">
              <div className={styles.data}>
                <TripInfo routs={routs} />
                <PassengersData />
                {additionalServices.length > 0 && (
                  <AdditionalServicesData addServ={additionalServices} />
                )}
              </div>
              {status === "CONFIRM" && (
                <>
                  <h1 className={`${styles.title} ${styles.blue}`}>
                    <FormattedMessage id="success" />
                  </h1>
                  <p className={styles.text}>
                    <FormattedMessage id="number" />
                    <span className={styles.blue}>{id}</span>
                  </p>
                  <a className={styles.link} href={url} target="_blank" rel="noreferrer">
                    <FormattedMessage id="download" />
                  </a>
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
            {/* <pre>{JSON.stringify(this.props.data, null, 4)}</pre> */}
            {/* <pre>{JSON.stringify(this.props.ticket, null, 4)}</pre> */}
          </div>
        )}
      </IntlProvider>
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
