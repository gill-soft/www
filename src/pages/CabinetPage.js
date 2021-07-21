import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import styles from "./CabinenPage.module.css";

import Wallet from "../components/CabinetContainer/Wallet";
import SearchBox from "../components/CabinetContainer/SearchBox";
import { getWalletInfo } from "../redux/order/orderOperation";

const CabinetPage = () => {
  const dispatch = useDispatch();
  const getWallet = useCallback(() => dispatch(getWalletInfo()), [dispatch]);

  useEffect(() => {
    getWallet();
  }, [getWallet]);

  return (
    <div className="container">
      <div className={styles.flex}>
        <div className={styles.flex1}>
          <Wallet />
        </div>
        <div className={styles.flex2}>
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default CabinetPage;
