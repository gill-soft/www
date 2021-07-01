import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicket } from "../redux/order/orderOperation";
import styles from "./AgentTicket.module.css";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";
import { useParams } from "react-router-dom";
import AdditionalServicesData from "../components/TicketContainer/AdditionalServicesData";

const AgentTicket = () => {
  const dispatch = useDispatch();
  const getTickenInfo = useCallback(
    (orderId) => dispatch(getTicket(orderId)),
    [dispatch]
  );
  const ticket = useSelector((state) => state.order.ticket);
  const [routs, setRouts] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const { orderId } = useParams();
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    // ==== самовызывающяяся функция redux====
    getTickenInfo(orderId);
  }, [dispatch, getTickenInfo, orderId]);
  useEffect(() => {
    setRouts([]);
  }, [ticket]);
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
  const getResultNew = () => {
    const expireTime = ticket.services[0].expire.split(" ").join("T");
    const msExpireTime = new Date(expireTime).getTime();
    const msNow = new Date().getTime();
    if (msExpireTime > msNow) {
      return "Квиток заброньвано";
    } else {
      return "Час бронювання закінчився";
    }
  };
  const getStatus = () => {
    const status = ticket.services[0].status;
    let result;
    switch (status) {
      case "NEW":
        result = getResultNew();
        break;
      case "CONFIRM":
        result = "Квиток сплачено";
        break;
      case "RETURN":
        result = "Квиток повернено";
        break;

      default:
        result = status;
        break;
    }
    return result;
  };

  return (
    <div className="bgnd">
      {Object.keys(ticket).length > 0 && routs.length > 0 ? (
        <div className="container">
          <div className={styles.statusBox}>
            <h3>Статус квитка:</h3>
            <p className={styles.status}>{getStatus()}</p>
          </div>
          <div className={styles.data}>
            <TripInfo routs={routs} />
            <PassengersData />
            {additionalServices.length > 0 && (
              <AdditionalServicesData addServ={additionalServices} />
            )}
          </div>
        </div>
      ) : (
        <h2> Інформацію по квитку {orderId} не знайдено</h2>
      )}
      {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
    </div>
  );
};

export default AgentTicket;
