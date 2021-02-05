import React from "react";
import { Link } from "react-router-dom";

const GoHome = () => {
  const handleClick = () => {};
  return (
    <div>
      <p>Время для оплаты закончилось</p>
      <Link to="/">Перейти на главную страницу</Link>
    </div>
  );
};

export default GoHome;
