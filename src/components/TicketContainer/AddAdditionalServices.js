import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAdditionalServices,
  getInitializationServices,
  updateTicketWithServices,
} from "../../services/api";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/TicketPageMessanges";
import { ReactComponent as Plus } from "../../images/add-black-18dp.svg";
import { ReactComponent as Minus } from "../../images/remove-black-18dp.svg";
import styles from "./AddAdditionalServices.module.css";
import { getTicket } from "../../redux/order/orderOperation";
import { getAdditionalServicesKeys } from "../../redux/order/orderSelectors";
import Loader from "../Loader/Loader";

const AddAdditionalServices = () => {
  const lang = useSelector((state) => state.language);
  const ticket = useSelector((state) => state.order.ticket);
  const addServ = useSelector(getAdditionalServicesKeys);
  const dispatch = useDispatch();
  const getTicketInfo = useCallback(
    (orderId) => dispatch(getTicket(orderId)),
    [dispatch]
  );
  const [newServices, setNewServices] = useState([]);
  const [summa, setSumma] = useState(0);
  const [data, setData] = useState(null);
  const [keys, setKeys] = useState([]);
  const [isLoader, setIsLoader] = useState(true);

  const locale = lang === "UA" ? "UK" : lang;

  // ==============
  useEffect(() => {
    // ==== инициализация поиска дополнительных сервисов ==== //
    const services = ticket.services
      .filter((el) => el.hasOwnProperty("segment"))
      .reduce((arr, el) => {
        arr.push({ id: el.id });
        return arr;
      }, []);
    getInitializationServices(ticket.orderId, services)
      .then(({ data }) => {
        getSearchServices(data.searchId, Date.now());
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
              setData(data.additionalServices);
            } else {
              return;
            }
          }
        })
        .catch((err) => console.log(err))
        .finally(setIsLoader(false));
    }
    if (deltaTime > 500) {
      setTimeout(() => {
        getAdditionalServices(searchId)
          .then(({ data }) => {
            if (data.searchId) {
              getSearchServices(data.searchId, time);
            } else {
              if (data.additionalServices) {
                setData(data.additionalServices);
              } else {
                return;
              }
            }
          })
          .catch((err) => console.log(err))
          .finally(setIsLoader(false));
      }, 300);
    }
  };
  //  ==== обновляем масив ключей дополнительніх услуг ==== //
  useEffect(() => {
    if (data) {
      const keys = [];
      for (let key of Object.keys(data)) {
        if (!addServ.includes(key)) keys.push(key);
      }
      setKeys(keys);
    }
  }, [data, addServ]);

  // ==== подсчитываем сумму дополнительных сервисов ==== //
  useEffect(() => {
    setSumma(
      newServices.reduce((summ, el) => {
        const amount = +data[el.additionalService.id].price.amount;
        return summ + amount;
      }, 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newServices]);

  //   ==== купить дополнительные услуги ==== //
  const insuranceBuy = () => {
    const data = {
      lang: lang,
      currency: "UAH",
    };
    data.customers = { 0: ticket.customers["0"] };
    data.services = newServices;
    updateTicketWithServices(ticket.orderId, data)
      .then(({ data }) => getTicketInfo(data.orderId))
      .catch((err) => console.log(err))
      .finally(setNewServices([]));
  };

  // ==== добавить дополнительную услугу ==== //
  const handleAddServices = (key) => {
    setNewServices((prev) => [
      ...prev,
      { additionalService: { id: key }, customer: { id: "0" } },
    ]);
  };

  // ==== удалить дополнительную услугу каунтером ==== //
  const handleRemoveOneServices = (key) => {
    setNewServices((prev) => {
      const index = prev.findIndex((el) => el.additionalService.id === key);
      const arr1 = prev.slice(0, index);
      const arr2 = prev.slice(index + 1);
      return [...arr1, ...arr2];
    });
  };

  // ==== удалить дополнительную услугу чекбоксом ==== //
  const handleRemoveServices = (key) => {
    setNewServices((prev) => prev.filter((el) => el.additionalService.id !== key));
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {isLoader && <Loader />}

      {keys.length > 0 && (
        <div className={styles.data}>
          {keys.map((key) => (
            <AddServ
              key={key}
              addKey={key}
              data={data}
              handleAddServices={handleAddServices}
              handleRemoveServices={handleRemoveServices}
              handleRemoveOneServices={handleRemoveOneServices}
            />
          ))}
          <div className={styles.total}>
            <p>
              <FormattedMessage id="addservices" />: {summa}{" "}
              <span>
                <FormattedMessage id="uah" />{" "}
              </span>
            </p>
            <button
              className={styles.totalbutton}
              disabled={newServices.length <= 0}
              onClick={() => insuranceBuy()}
            >
              <FormattedMessage id="addBtn" />
            </button>
          </div>
        </div>
      )}
    </IntlProvider>
  );
};
export default AddAdditionalServices;

const AddServ = ({
  addKey,
  data,
  handleAddServices,
  handleRemoveServices,
  handleRemoveOneServices,
}) => {
  const lang = useSelector((state) => state.language);

  const [count, setCount] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  const locale = lang === "UA" ? "UK" : lang;
  //   ==== управление чекбоксом ==== //
  const handleChange = () => {
    if (isChecked) {
      handleRemoveServices(addKey);
      setCount(1);
    } else {
      handleAddServices(addKey);
    }
    setIsChecked(!isChecked);
  };

  //  ==== уменьшаем количество дополнительной услуги ==== //
  const onDecrement = () => {
    setCount(count - 1);
    handleRemoveOneServices(addKey);
  };

  //  ==== увеличиваем количество дополнительной услуги ==== //
  const onIncrement = () => {
    setCount(count + 1);
    handleAddServices(addKey);
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.box}>
        <div className={styles.flex}>
          <div className={styles.item}>
            <div className={styles.img}>
              <img
                src={`https://busis.eu/gds-sale/api/v1/additional/icon/${data[addKey].additionals.iconId}`}
                alt="icon"
              />
            </div>
            <div className={styles.description}>
              <b className={styles.nameAddServ}>
                {data[addKey].name[lang]}: {data[addKey].price.amount}
                <small>
                  <FormattedMessage id="uah" />
                </small>
              </b>
              <p>{data[addKey].description[lang]}</p>
              {/* {!addServ.additionalServices[addKey].enableReturn && (
                <i>(поверненню не підлягає)</i>
              )} */}
            </div>
          </div>

          <input
            type="checkbox"
            className={styles.checkbox}
            onChange={handleChange}
            checked={isChecked}
          />
        </div>

        {isChecked && data[addKey].enableCount && (
          <div className={styles.controlers}>
            <button
              type="button"
              onClick={onDecrement}
              disabled={count <= 1}
              className={styles.btn}
            >
              <Minus />
            </button>
            <span>{count}</span>
            <button type="button" onClick={onIncrement} className={styles.btn}>
              <Plus />
            </button>
          </div>
        )}
      </div>
    </IntlProvider>
  );
};
