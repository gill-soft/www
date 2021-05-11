import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Plus } from "../../images/add-black-18dp.svg";
import { ReactComponent as Minus } from "../../images/remove-black-18dp.svg";
import { setAdditionalServices } from "../../redux/order/orderActions";

const AdditionalsServices = () => {
  const trips = useSelector((state) => state.trips.trips);
  const tripKeys = useSelector((state) => state.order.tripKeys);
  const addServicesKeys = useSelector((state) => state.order.additionalServicesKeys);

  const dispatch = useDispatch();
  const sendAdditionalServices = useCallback(
    (arr) => {
      dispatch(setAdditionalServices(arr));
    },
    [dispatch]
  );

  const [addServicesArray, setAddServicesArray] = useState([]);

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

  
  // ==== подсчитываем общую сумму дополнительных услуг ==== //
  const getTotal = () => {
    return addServicesKeys.reduce((acc, key) => {
      acc += trips.additionalServices[key].price.amount;
      return acc;
    }, 0);
  };

  return (
    <div>
      <h3>DopUslugi</h3>
      {addServicesArray.length > 0 &&
        addServicesArray.map((key) => <AddServ key={key} addKey={key} />)}
      <p>
        Вартість додаткових послуг: {getTotal()} <small>uah</small>
      </p>
    </div>
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
    <div>
      <p>
        {trips.additionalServices[addKey].name[lang]}:{" "}
        {trips.additionalServices[addKey].price.amount}
        <small>{trips.additionalServices[addKey].price.currency}</small>
      </p>
      <p>{trips.additionalServices[addKey].description[lang]}</p>
      <div style={{ width: "50px", height: "50px" }}>
        <img
          src={`https://busis.eu/gds-sale/api/v1/additional/icon/${trips.additionalServices[addKey].additionals.iconId}`}
          alt="icon"
        />
      </div>
      <input type="checkbox" onChange={handleChange} checked={isChecked} />
      {/* <p>{price}</p> */}
      {isChecked && trips.additionalServices[addKey].enableCount && (
        <>
          <div>
            <button type="button" onClick={onDecrement} disabled={count <= 1}>
              <Minus />
            </button>
            <span>{count}</span>
            <button type="button" onClick={onIncrement}>
              <Plus />
            </button>
            <p>Всього: {price}</p>
          </div>
        </>
      )}
      {!trips.additionalServices[addKey].enableReturn && <p>поверненню не підлягає</p>}
      <hr />
    </div>
  );
};
