import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import FormForBuy from "../components/Order/FormForBuy";
import styles from "./OrderPage.module.css";
import { getRequaredFields } from "../services/api";

const OrderPage = ({ history }) => {
  const amountPassangers = useSelector((state) => state.searchForm.amountPassanger);
  const tripKeys = useSelector((state) => state.order.tripKeys);
  const [totalPassanger, setTotalPassanger] = useState(amountPassangers);
  const [requeredFields, setRequeredFields] = useState([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // ==== получаем список обязательных полей ==== //
  useEffect(() => {
    if (tripKeys)
      tripKeys.forEach((tripKey) => {
        getRequaredFields(tripKey)
          .then(({ data }) => setRequeredFields([...requeredFields, ...data]))
          .catch((err) => console.log(err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripKeys]);
  // ==== при перезагрузке страницы попадаем на предыдущую
  // ==== при переходе по ссылке перенаправление на главную
  useEffect(() => {
    if (tripKeys.length <= 0) {
      const path = JSON.parse(sessionStorage.getItem("path")) || "/";
      history.replace(path);
    }
  }, [history, tripKeys]);
  return (
    <>
      {tripKeys.length > 0 && (
        <div className="bgnd">
          <div className="container">
            <div className={styles.main}>
              <div>
                <FormForBuy
                  changeAmountPassanger={(val) => setTotalPassanger(val)}
                  total={totalPassanger}
                  history={history}
                  requeredFields={requeredFields}
                />
              </div>
              <OrderInfo total={totalPassanger} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPage;
