import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./TicketPage.module.css";
import PaymentBox from "../components/TicketContainer/PaymentBox";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import AdditionalServicesData from "../components/TicketContainer/AdditionalServicesData";
import AddAdditionalServices from "../components/TicketContainer/AddAdditionalServices";
import Loader from "../components/Loader/Loader";
import { getTicket } from "../redux/order/orderOperation";

const TicketPage = () => {
  const dispatch = useDispatch();
  const getTicketInfo = useCallback(
    (orderId) => dispatch(getTicket(orderId)),
    [dispatch]
  );
  const ticket = useSelector((state) =>state.order.ticket);
  const [isLoader, setIsLoader] = useState(false);

  const { orderId } = useParams();
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    // ==== получаем зашифрованый id === //
    const encryptId = atob(orderId);
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVeze").toString(CryptoJS.enc.Utf8);

    // ==== получаем информацию о билете ====
    getTicketInfo(id);
  }, [getTicketInfo, orderId]);
  console.log(ticket)
  return (
    <div className="bgnd">
      {Object.keys(ticket).length && (
        <div className="container">
          <div className={styles.data}>
            <TripInfo />
            <PassengersData />
            <AdditionalServicesData />
          </div>
          <AddAdditionalServices />
          <div className={styles.data}>
            <PaymentBox orderId={orderId} />
          </div>
        </div>
      )}
      {isLoader && <Loader />}

      {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
    </div>
  );
};

export default TicketPage;
