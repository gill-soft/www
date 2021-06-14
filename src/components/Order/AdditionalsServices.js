import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { messages } from "../../intl/OrderPageMessanges";
import { ReactComponent as Plus } from "../../images/add-black-18dp.svg";
import { ReactComponent as Minus } from "../../images/remove-black-18dp.svg";
import { setAdditionalServices } from "../../redux/order/orderActions";
import styles from "./AdditionalsServices.module.css";

const AdditionalsServices = () => {
  const trips = useSelector((state) => state.trips.trips);
  const tripKeys = useSelector((state) => state.order.tripKeys);
  const lang = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const sendAdditionalServices = useCallback(
    (arr) => {
      dispatch(setAdditionalServices(arr));
    },
    [dispatch]
  );

  const [addServicesArray, setAddServicesArray] = useState([]);
  const locale = lang === "UA" ? "UK" : lang;

  useEffect(() => {
    //   ==== получаем масив ключей всех дополнительных услуг ==== //
    const arrKeys = Array.from(
      new Set(
        tripKeys
          .reduce((acc, key) => {
            if (Object.keys(trips.segments[key]).includes("additionalServices")) {
              acc.push(
                trips.segments[key].additionalServices.reduce((arr, el) => {
                  arr.push(el.id);
                  return arr;
                }, [])
              );
            }
            return acc;
          }, [])
          .flat()
      )
    );
    setAddServicesArray(arrKeys);
    sendAdditionalServices(arrKeys);
  }, [sendAdditionalServices, tripKeys, trips.segments]);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {addServicesArray.length > 0 && (
        <div className={styles.passangersData}>
          <h3 className={styles.title}>
            <FormattedMessage id="additionalService" />
          </h3>
          {addServicesArray.length > 0 &&
            addServicesArray.map((key) => <AddServ key={key} addKey={key} />)}
        </div>
      )}
    </IntlProvider>
  );
};

export default AdditionalsServices;

const AddServ = ({ addKey }) => {
  const trips = useSelector((state) => state.trips.trips);
  const lang = useSelector((state) => state.language);
  const [price, setPrice] = useState(trips.additionalServices[addKey].price.amount);
  const [count, setCount] = useState(1);
  const [isChecked, setIsChecked] = useState(true);
  const addServicesKeys = useSelector((state) => state.order.additionalServicesKeys);
  const dispatch = useDispatch();
  const sendAdditionalServices = useCallback(
    (arr) => {
      dispatch(setAdditionalServices(arr));
    },
    [dispatch]
  );
  const locale = lang === "UA" ? "UK" : lang;

  // ==== управление чекбоксом ==== //
  const handleChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      sendAdditionalServices([...addServicesKeys, addKey]);
    } else {
      sendAdditionalServices(addServicesKeys.filter((el) => el !== addKey));
      setCount(1);
      setPrice(trips.additionalServices[addKey].price.amount);
    }
  };
  //  ==== уменьшаем количество дополнительной услуги ==== //
  const onDecrement = () => {
    setCount(count - 1);
    const countKeys = [];
    for (let i = 1; i < count; i++) {
      countKeys.push(addKey);
    }
    setPrice(
      countKeys.reduce((summ, key) => {
        summ += trips.additionalServices[key].price.amount;
        return summ;
      }, 0)
    );
    sendAdditionalServices([
      ...addServicesKeys.filter((key) => key !== addKey),
      ...countKeys,
    ]);
  };

  //  ==== увеличиваем количество дополнительной услуги ==== //
  const onIncrement = () => {
    setCount(count + 1);
    const countKeys = [];
    for (let i = 0; i <= count; i++) {
      countKeys.push(addKey);
    }
    setPrice(
      countKeys.reduce((summ, key) => {
        summ += trips.additionalServices[key].price.amount;
        return summ;
      }, 0)
    );
    sendAdditionalServices([
      ...addServicesKeys.filter((key) => key !== addKey),
      ...countKeys,
    ]);
  };
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className={styles.box}>
        <div className={styles.flex}>
          <div className={styles.item}>
            <div className={styles.img}>
              <img
                src={`https://busis.eu/gds-sale/api/v1/additional/icon/${trips.additionalServices[addKey].additionals.iconId}`}
                alt="icon"
              />
            </div>
            <div className={styles.description}>
              <b className={styles.nameAddServ}>
                {trips.additionalServices[addKey].name[lang]}:{" "}
                {trips.additionalServices[addKey].price.amount}
                <small>
                  <FormattedMessage id="uah" />
                </small>
              </b>

              <p>{trips.additionalServices[addKey].description[lang]}</p>
              {!trips.additionalServices[addKey].enableReturn && (
                <i>(поверненню не підлягає)</i>
              )}
            </div>
          </div>

          <input
            type="checkbox"
            className={styles.checkbox}
            onChange={handleChange}
            checked={isChecked}
          />
        </div>

        {isChecked && trips.additionalServices[addKey].enableCount && (
          <div className={styles.total}>
            <p>
              <strong>
                <FormattedMessage id="total" /> {price}{" "}
                <small>
                  <FormattedMessage id="uah" />
                </small>
              </strong>
            </p>

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
