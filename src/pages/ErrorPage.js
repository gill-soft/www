import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getError } from "../redux/global/globalActions";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  const dispatch = useDispatch();

  return (
    <div className="container">
      <p className={styles.smile}>Oops..! something went wrong</p>
      <Link to="/" className={styles.link} onClick={() => dispatch(getError(""))}>
        Повернутися на головну сторінку
      </Link>
    </div>
  );
};

export default ErrorPage;
