import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import styles from "./Skelet.module.css";

const Scelet = () => {
  return (
    <>
      {Array.from(new Array(5)).map((el, idx) => (
        <div key={idx} className={styles.box}>
          <div className={styles.toFrom}>
            <div className={styles.departure}>
              <Skeleton variant="rect" width={70} height={30} />
              <Skeleton type="text" width={60} />
              <Skeleton variant="rect" width={80} height={15} />
              <Skeleton type="text" width={220} />
            </div>
            <div className={styles.arrival}>
              <Skeleton variant="rect" width={70} height={30} />
              <Skeleton type="text" width={60} />
              <Skeleton variant="rect" width={90} height={15} />
              <Skeleton type="rect" width={190} height={15} />
            </div>
          </div>
          <div className={styles.price}>
            <Skeleton variant="rect" width={80} height={20} />
            <Skeleton variant="rect" width={80} height={25} />
            <Skeleton variant="rect" width={80} height={38} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Scelet;
