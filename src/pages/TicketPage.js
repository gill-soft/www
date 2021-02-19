import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getTicket } from "../redux/order/orderOperation";
import styles from "./TicketPage.module.css";
import PaymentBox from "../components/TicketContainer/PaymentBox";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";

const TicketPage = ({ lang, match, ticket, getTicket }) => {
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    const id = match.params.id;
    getTicket(id);
  }, [getTicket, match.params.id]);

  // ==== получаем название населенного пункта отправки/прибытия ====//
  const getLocality = (type) => {
    const tripKey = Object.keys(ticket.segments)[0];
    const stopId = ticket.segments[`${tripKey}`][`${type}`].id;
    const id = ticket.localities[`${stopId}`].parent.id;
    return ticket.localities[`${id}`]?.name[`${lang}`];
  };

  // ==== получаем время отправки/прибытия ====//
  const getDate = (type) => {
    const tripKey = Object.keys(ticket.segments)[0];
    return ticket.segments[`${tripKey}`][`${type}`];
  };
  return (
    <div className={styles.bgnd}>
      {Object.keys(ticket).length > 0 && (
        <div className={styles.container}>
          <TripInfo ticket={ticket} getLocality={getLocality} getDate={getDate} />
          <PassengersData ticket={ticket} />
          <PaymentBox getLocality={getLocality} getDate={getDate} id={match.params.id} />
        </div>
      )}

      {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticket: state.order.ticket,
  lang: state.language,
});

const mapDispatchToProps = (dispatch) => ({
  getTicket: (id) => dispatch(getTicket(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketPage);
