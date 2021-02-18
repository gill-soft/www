import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Timer.module.css";

const Timer = () => {
  const ticket = useSelector((state) => state.order.ticket);
  const [time, setTime] = useState(0);
  useEffect(() => {
    const timeEnd = new Date(ticket.services[0].expire).getTime();
    const timeStart = new Date().getTime();
    setTime(timeEnd - timeStart);
  }, [ticket]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(time - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);
  console.log("time");
  return (
    <p className={styles.time}>
      {new Date(time).toLocaleString("uk", {
        minute: "2-digit",
        second: "2-digit",
      })}
    </p>
  );
};

export default Timer;
