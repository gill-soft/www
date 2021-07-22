import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicket } from "../redux/order/orderOperation";
import styles from "./AgentTicket.module.css";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";
import { useParams } from "react-router-dom";
import AdditionalServicesData from "../components/TicketContainer/AdditionalServicesData";

const ViewTicket = () => {
  const dispatch = useDispatch();
  const getTickenInfo = useCallback(
    (orderId) => dispatch(getTicket(orderId)),
    [dispatch]
  );
  const ticket = useSelector((state) => state.order.ticket);
  const lang = useSelector((state) => state.language);
  const { orderId } = useParams();
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    // ==== самовызывающяяся функция redux====
    getTickenInfo(orderId);
  }, [dispatch, getTickenInfo, orderId]);

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
