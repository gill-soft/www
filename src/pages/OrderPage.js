import React from "react";
import SearchForm from "../components/SearchForm/SearchForm";

const OrderPage = ({history, match}) => {
  // console.log(match.params)
  return (
    <div>
      <SearchForm history ={history}/>
      <p >lorem300</p>
    </div>
  );
};

export default OrderPage;
