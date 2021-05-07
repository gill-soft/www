import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIcon } from "../../services/api";

const AdditionalsServices = () => {
  const trips = useSelector((state) => state.trips.trips);
  const tripKeys = useSelector((state) => state.order.tripKeys);
  const [addServicesArray, setAddServicesArray] = useState([]);
  const [total, setTotal] = useState(0);

  //   console.log(trips);
  //   console.log(trips.segments[tripKeys[0]].additionalServices);

  useEffect(() => {
    //   ==== получаем масив ключей всех дополнительных услуг ==== //
    setAddServicesArray(
      Array.from(
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
      )
    );
  }, [tripKeys, trips.segments]);
  // console.log(addServicesArray);
  const dec = (val) => {
    setTotal(total - val);
  };
  const inc = (val) => {
    setTotal(total + val);
  };
  return (
    <div>
      <h3>DopUslugi</h3>
      {addServicesArray.length > 0 &&
        addServicesArray.map((key) => (
          <AddServ key={key} addKey={key} inc={inc} dec={dec} />
        ))}
      <p>Вартість додаткових послуг: {total}</p>
    </div>
  );
};

export default AdditionalsServices;

const AddServ = ({ addKey, inc, dec }) => {
  const trips = useSelector((state) => state.trips.trips);
  const [price, setPrice] = useState(trips.additionalServices[addKey].price.amount);
  const [count, setCount] = useState(1);

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked(!isChecked);

    isChecked ? dec(price) : inc(price);
  };

  const onDecrement = () => {
    setCount(count - 1);
    setPrice(price - trips.additionalServices[addKey].price.amount);
    dec(trips.additionalServices[addKey].price.amount);
  };
  const onIncrement = () => {
    setCount(count + 1);
    setPrice(price + trips.additionalServices[addKey].price.amount);
    inc(trips.additionalServices[addKey].price.amount);
  };
  return (
    <div>
      <p>
        {trips.additionalServices[addKey].name["RU"]}:{" "}
        {trips.additionalServices[addKey].price.amount}
        <small>{trips.additionalServices[addKey].price.currency}</small>
      </p>
      <p>{trips.additionalServices[addKey].description["RU"]}</p>
      <div style={{ width: "50px", height: "50px" }}>
        <img
          src={`https://busis.eu/gds-sale/api/v1/additional/icon/${trips.additionalServices[addKey].additionals.iconId}`}
          alt="icon"
        />
      </div>
      <input type="checkbox" onChange={handleChange} />
      {/* <p>{price}</p> */}
      {isChecked && trips.additionalServices[addKey].enableCount && (
        <>
          <div>
            <button type="button" onClick={onDecrement}>
              -
            </button>
            <span>{count}</span>
            <button type="button" onClick={onIncrement}>
              +
            </button>
            <p>Всого: {price}</p>
          </div>
        </>
      )}
      {!trips.additionalServices[addKey].enableReturn && <p>поверненню не підлягає</p>}
      <hr />
    </div>
  );
};
