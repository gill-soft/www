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
  const [isLoader, setIsLoader] = useState(true);
  const [additionalServicesKeys, setAdditionalServicesKeys] = useState([]);
  const [newAddServicesData, setNewAddServicesData] = useState(null);
  const [newAddServicesKeys, setNewAddServicesKeys] = useState([]);

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
      const routs = [];
      for (let [key, values] of Object.entries(ticket.segments)) {
        routs.push({ [key]: values });
      }

      setRouts(
        routs.sort((a, b) => {
          const A = new Date(a[Object.keys(a)[0]].departureDate).getTime();
          const B = new Date(b[Object.keys(b)[0]].departureDate).getTime();
          return A - B;
        })
      );
      // ==== определяем масив всех уникальных ключей дополнительных сервисов ==== //
      setAdditionalServicesKeys(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]);

  useEffect(() => {
    if (Object.keys(ticket).length > 0) {
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
  }, [additionalServicesKeys]);

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
              getAdditionalServicesInfo(data);
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
                getAdditionalServicesInfo(data);
              } else {
                return;
              }
            }
          })
          .catch((err) => console.log(err));
      }, 300);
    }
  };
  const getAdditionalServicesInfo = (data) => {
    const keys = [];
    for (let key of Object.keys(data.additionalServices)) {
      if (!additionalServicesKeys.includes(key)) keys.push(key);
    }
    setNewAddServicesData(data.additionalServices);
    setNewAddServicesKeys(keys);
  };
  const changeRouts = () => {
    setRouts([]);
    setIsLoader(true);
    
  };
  
  return (
    <div className="bgnd">
      {routs.length > 0 && (
        <div className="container">
          <div className={styles.data}>
            <TripInfo routs={routs} />
            <PassengersData />
            {additionalServicesKeys.length > 0 && (
              <AdditionalServicesData addServ={additionalServicesKeys} />
            )}
          </div>
          {newAddServicesKeys.length > 0 && (
            <div className={styles.data}>
              <AddAdditionalServices
                data={newAddServicesData}
                keys={newAddServicesKeys}
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
