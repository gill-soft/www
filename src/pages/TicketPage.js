import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicket } from "../redux/order/orderOperation";
// import styles from "./TicketPage.module.css";
import PaymentBox from "../components/TicketContainer/PaymentBox";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";
import CryptoJS from "crypto-js";

const TicketPage = ({ match }) => {
  const dispatch = useDispatch();
  const ticket = useSelector((state) => state.order.ticket);
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    // ==== получаем зашифрованый id === //
    const encryptId = atob(match.params.id);
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVeze").toString(CryptoJS.enc.Utf8);
    // ==== самовызывающяяся функция redux====
    ((id) => dispatch(getTicket(id)))(id);
  }, [dispatch, match.params]);

  // ==== получаем id населенного пункта отправки/прибытия ====//
  const getLocalityId = (type) => {
    const tripKey = Object.keys(ticket.segments)[0];
    const stopId = ticket.segments[`${tripKey}`][`${type}`].id;
    return ticket.localities[`${stopId}`].parent.id;
  };

  // ==== получаем время отправки/прибытия ====//
  const getDate = (type) => {
    const tripKey = Object.keys(ticket.segments)[0];
    return ticket.segments[`${tripKey}`][`${type}`];
  };
  return (
    <div className="bgnd">
      {Object.keys(ticket).length > 0 && (
        <div className="container">
          <TripInfo />
          <PassengersData />
          <PaymentBox
            fromId={getLocalityId("departure")}
            toId={getLocalityId("arrival")}
            getDate={getDate}
            id={match.params.id}
            payeeId={match.params.pay}
          />
        </div>
      )}
      {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
    </div>
  );
};

export default TicketPage;
