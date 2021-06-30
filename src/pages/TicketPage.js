import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicket } from "../redux/order/orderOperation";
import styles from "./TicketPage.module.css";
import PaymentBox from "../components/TicketContainer/PaymentBox";
import TripInfo from "../components/TicketContainer/TripInfo";
import PassengersData from "../components/TicketContainer/PassengersData";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import AdditionalServicesData from "../components/TicketContainer/AdditionalServicesData";
import { getAdditionalServices, getInitializationServices } from "../services/api";
import AddAdditionalServices from "../components/TicketContainer/AddAdditionalServices";
import Loader from "../components/Loader/Loader";

const TicketPage = () => {
  const dispatch = useDispatch();
  const getTicketInfo = useCallback(
    (orderId) => dispatch(getTicket(orderId)),
    [dispatch]
  );
  const ticket = useSelector((state) => state.order.ticket);
  const [routs, setRouts] = useState([]);
  const [newAddServicesData, setNewAddServicesData] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  const [additionalServices, setAdditionalServices] = useState([]);
  const { orderId } = useParams();
  // ==== получаем информацию о билете ==== //
  useEffect(() => {
    // ==== получаем зашифрованый id === //
    const encryptId = atob(orderId);
    // ==== расшифровуем id ==== //
    const id = CryptoJS.AES.decrypt(encryptId, "KeyVeze").toString(CryptoJS.enc.Utf8);
    // ==== самовызывающяяся функция redux====
    getTicketInfo(id);
  }, [getTicketInfo, orderId]);

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
      // ==== инициализация поиска дополнительных сервисов ==== //
      const services = ticket.services
        .filter((el) => el.hasOwnProperty("segment"))
        .reduce((arr, el) => {
          arr.push({ id: el.id });
          return arr;
        }, []);
      getInitializationServices(ticket.orderId, services)
        .then(({ data }) => {
          setIsLoader(false);
          getSearchServices(data.searchId, Date.now());
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]);

  // ==== поиск дополнительных сервисов ==== //
  const getSearchServices = (searchId, time) => {
    const deltaTime = Date.now() - time;
    if (deltaTime <= 500) {
      getAdditionalServices(searchId)
        .then(({ data }) => {
          if (data.searchId) {
            getSearchServices(data.searchId, time);
          } else {
            if (data.additionalServices) {
              setNewAddServicesData(data);
            } else {
              return;
            }
          }
        })
        .catch((err) => console.log(err));
    }
    if (deltaTime > 500) {
      setTimeout(() => {
        getAdditionalServices(searchId)
          .then(({ data }) => {
            if (data.searchId) {
              getSearchServices(data.searchId, time);
            } else {
              if (data.additionalServices) {
                setNewAddServicesData(data);
              } else {
                return;
              }
            }
          })
          .catch((err) => console.log(err));
      }, 300);
    }
  };
  const changeRouts = () => {
    setRouts([]);
    setIsLoader(true)
  };
  
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
          {newAddServicesData && (
            <div className={styles.data}>
              <AddAdditionalServices
                addServ={newAddServicesData}
                changeRouts={changeRouts}
              />
            </div>
          )}
          <div className={styles.data}>
            <PaymentBox routs={routs} orderId={orderId} />
          </div>
        </div>
      )}
      {isLoader && <Loader />}

      {/* <pre>{JSON.stringify(ticket, null, 4)} </pre> */}
    </div>
  );
};

export default TicketPage;
