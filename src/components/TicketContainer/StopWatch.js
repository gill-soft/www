import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GoHome from "../GoHome/GoHome";
import Modal from "@material-ui/core/Modal";
import styles from "./PaymentBox.module.css";

const StopWatch = () => {
  const ticket = useSelector((state) => state.order.ticket);
  const [time, setTime] = useState(0);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    //   определяем время до конца оплаты ==== //
    const dateEnd = ticket.services[0].expire.split(" ").join("T");
    const timeEnd = new Date(dateEnd).getTime();
    setTime(timeEnd - Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //  ==== секундомер ==== //
  useEffect(() => {
    if (time < 0) {
      setIsModal(true);
      setTime(0);
      return;
    }
    const intervalId = setInterval(() => {
      setTime(time - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);
  return (
    <div>
      <p className={styles.time}>
        {new Date(time).toLocaleString("uk", {
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
      {/* <Modal open={isModal} disableBackdropClick={true}>
        <GoHome />
      </Modal> */}
    </div>
  );
};

export default StopWatch;
