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
  const [routs, setRouts] = useState([]);

  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    
    // ==== получаем зашифрованый id === //
    const encryptId = atob(match.params.id);
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVeze").toString(CryptoJS.enc.Utf8);
    // ==== самовызывающяяся функция redux====
    ((id) => dispatch(getTicket(id)))(id);
  }, [dispatch, match.params]);
  
  useEffect(() => {
    if (Object.keys(ticket).length > 0) {
      const arr = [];
      for (let [key, values] of Object.entries(ticket.segments)) {
        arr.push({ [key]: values });

        setRouts(
          arr.sort((a, b) => {
            const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
            const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
            return A - B;
          })
        );
      }
    }
  }, [ticket]);

  return (
    <div className="bgnd">
      {Object.keys(ticket).length > 0 && (
        <div className="container">
          <TripInfo routs={routs} />
          <PassengersData />
          <PaymentBox routs={routs} id={match.params.id} payeeId={match.params.pay} />
        </div>
      )}
      <pre>{JSON.stringify(ticket, null, 4)} </pre>
    </div>
  );
};

export default TicketPage;
