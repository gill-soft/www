import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicket } from "../redux/order/orderOperation";
import styles from "./TicketPage.module.css";
import PaymentBox from "../components/TicketContainer/PaymentBox";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import AdditionalServicesData from "../components/TicketContainer/AdditionalServicesData";

const TicketPage = () => {
  const dispatch = useDispatch();
  const ticket = useSelector((state) => state.order.ticket);
  const [routs, setRouts] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const { orderId, primary, secondary } = useParams();
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    // ==== получаем зашифрованый id === //
    const encryptId = atob(orderId);
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVeze").toString(CryptoJS.enc.Utf8);
    // ==== самовызывающяяся функция redux====
    ((orderId) => dispatch(getTicket(orderId)))(id);
  }, [dispatch, orderId]);

  useEffect(() => {
    if (Object.keys(ticket).length > 0) {
      const arr = [];
      for (let [key, values] of Object.entries(ticket.segments)) {
        arr.push({ [key]: values });
      }
      setRouts(
        arr.sort((a, b) => {
          const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
          const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
          return A - B;
        })
      );

      // ==== определяем масив всех уникальных ключей дополнительных сервисов ==== //
      setAdditionalServices(
        Array.from(
          new Set(
            ticket.services
              .filter((el) => el.hasOwnProperty("additionalService"))
              .reduce((arr, el) => {
                arr.push(el.additionalService.id);
                return arr;
              }, [])
          )
        )
      );
    }
  }, [ticket]);
  return (
    <div className="bgnd">
      {routs.length > 0 && (
        <div className="container">
          <div className={styles.data}>
            <TripInfo routs={routs} />
            <PassengersData />
            {additionalServices.length > 0 && (
              <AdditionalServicesData addServ={additionalServices} />
            )}
          </div>
          <div className={styles.data}>
            <PaymentBox
              routs={routs}
              orderId={orderId}
              primary={primary}
              secondary={secondary}
            />
          </div>
        </div>
      )}
      {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
    </div>
  );
};

export default TicketPage;
