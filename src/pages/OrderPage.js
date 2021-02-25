import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import OrderInfo from "../components/Order/OrderInfo";
import SearchForm from "../components/SearchForm/SearchForm";
import FormForBuy from "../components/Order/FormForBuy";
// import { useSelector } from "react-redux";
// import FormForBuyMap from "../components/Order/FormForBuyMap";

import styles from "./OrderPage.module.css";
import { startLoader } from "../redux/global/globalActions";
// import { getRequaredFields } from "../services/api";

const OrderPage = ({
  history,
  amountPassangers,
  order,
  startLoader,
  tripKey,
}) => {
  const [totalPassanger, setTotalPassanger] = useState(amountPassangers);

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
  }, [order, history, startLoader]);

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
          />
          <OrderInfo total={totalPassanger} />

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
        </div>
      </div>
    </div>
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
