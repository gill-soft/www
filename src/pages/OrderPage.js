import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/Order/FormForBuy";
import styles from "./OrderPage.module.css";
import { getRequaredFields } from "../services/api";

const OrderPage = ({ history }) => {
  const amountPassangers = useSelector((state) => state.searchForm.amountPassanger);
  const order = useSelector((state) => state.order.order);
  const tripKey = useSelector((state) => state.order.order.tripKey);

  const [totalPassanger, setTotalPassanger] = useState(amountPassangers);
  const [requeredFields, setRequeredFields] = useState([]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // ==== получаем список обязательніх полей ==== //
  useEffect(() => {
    if (tripKey)
      getRequaredFields(tripKey)
        .then(({ data }) => setRequeredFields(data))
        .catch((err) => console.log(err));
  }, [tripKey]);

  // ==== при перезагрузке страницы попадаем на предыдущую
  // ==== при переходе по ссылке перенаправление на главную
  useEffect(() => {
    if (Object.keys(order).length <= 0) {
      const path = JSON.parse(sessionStorage.getItem("path")) || "/";
      history.replace(path);
    }
  }, [order, history]);
  return (
    <div className="bgnd">
      <div className="container">
        <div className={styles.formBox}>
          <SearchForm history={history} />
        </div>
        <div className={styles.main}>
          <FormForBuy
            changeAmountPassanger={(val) => setTotalPassanger(val)}
            total={totalPassanger}
            history={history}
            requeredFields={requeredFields}
          />
          <OrderInfo total={totalPassanger} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
