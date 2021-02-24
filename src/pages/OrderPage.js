import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/Order/FormForBuy";
import { useSelector } from "react-redux";
import FormForBuyMap from "../components/Order/FormForBuyMap";

import styles from "./OrderPage.module.css";
import { startLoader } from "../redux/global/globalActions";
import { getRequaredFields } from "../services/api";

const OrderPage = ({
  history,
  amountPassangers,
  order,
  location,
  startLoader,
  tripKey,
}) => {
  const [totalPassanger, setTotalPassanger] = useState(amountPassangers);

  const changeAmountPassanger = (val) => {
    setTotalPassanger(val);
  };
  // useEffect(() => {
  //   getRequaredFields(tripKey).then(({data}) => console.log(data))

  // }, [tripKey])

  // ==== при перезагрузке страницы попадаем на предыдущую
  // ==== при переходе по ссылке перенаправление на главную
  useEffect(() => {
    if (Object.keys(order).length <= 0) {
      const path = JSON.parse(sessionStorage.getItem("path")) || "/";
      history.replace(path);
      startLoader();
    }
  }, [location, order, history, startLoader]);

  return (
    <>
      <div className={styles.formBox}>
        <SearchForm history={history} />
      </div>
      <div className={styles.main}>
        <FormForBuy
          changeAmountPassanger={changeAmountPassanger}
          total={totalPassanger}
          history={history}
        />
        {/* {pass.pass.length > 0 && (
            <FormForBuyMap
              changeAmountPassanger={changeAmountPassanger}
              total={totalPassanger}
              history={history}
              array={[
                "NAME",
                "PATRONYMIC",
                "SURNAME",
                "ONLY_LATIN",
                "EMAIL",
                "PHONE",
                "GENDER",
                "CITIZENSHIP",
                "DOCUMENT_TYPE",
                "DOCUMENT_NUMBER",
                "DOCUMENT_SERIES",
                "BIRTHDAY",
                "SEAT",
                "TARIFF",
              ]}
              pass={pass}
            />
          )} */}

        <OrderInfo total={totalPassanger} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  amountPassangers: state.searchForm.amountPassanger,
  order: state.order.order,
  tripKey: state.order.order.tripKey,
});
const mapDispatchToProps = (dispatch) => ({
  startLoader: (obj) => dispatch(startLoader(obj)),
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
