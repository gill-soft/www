import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicket } from "../redux/order/orderOperation";
import styles from "./AgentTicket.module.css";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";
import { useParams } from "react-router-dom";
import AdditionalServicesData from "../components/TicketContainer/AdditionalServicesData";
import { getLang } from "../redux/Language/LanguageSelectors";
import { changeError } from "../services/getError";
import { getError } from "../redux/global/globalActions";
import { getTicketPrint } from "../services/api";

const ViewTicket = () => {
  const dispatch = useDispatch();
  const ticket = useSelector((state) => state.order.ticket);
  const lang = useSelector(getLang);
  const error = useSelector((state) => state.global.error);
  const { orderId } = useParams();

  const getTickenInfo = useCallback(
    (orderId) => dispatch(getTicket(orderId)),
    [dispatch]
  );
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    // ==== самовызывающяяся функция redux====
    getTickenInfo(orderId);
  }, [dispatch, getTickenInfo, orderId]);

  useEffect(() => {
    if (ticket) {
      if (ticket.hasOwnProperty("error")) {
        const msgErr = changeError(ticket.error.name);
        getError(msgErr);
        return;
      }
      if (ticket.services.every((el) => el.status === "CONFIRM")) {
        // ==== получаем билеты для печати ==== //
        getTicketPrint(orderId, lang)
          .then(({ data }) => {
            console.log(data);
            // getPDF(data.documents[0].base64);
          })
          .catch((err) => console.log(err));
      }
    }
  }, [ticket]);

  return (
    <div className="bgnd">
      {ticket && !ticket?.hasOwnProperty("error") ? (
        <div className="container">
          <div className={styles.data}>
            <TripInfo />
            <PassengersData status={true} />
            <AdditionalServicesData />
          </div>
        </div>
      ) : (
        <h2> Інформацію по квитку {orderId} не знайдено</h2>
      )}
      {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
    </div>
  );
};

export default ViewTicket;
