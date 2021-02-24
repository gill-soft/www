import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import MyTicketPage from "../pages/MyTicketPage";
import OrderPage from "../pages/OrderPage";
import TicketPage from "../pages/TicketPage";
import TripsPage from "../pages/TripsPage";
import { fetchStops } from "../redux/global/globalOperations";
import Header from "./Header/Header";

const App = () => {
  // ====redux===//
  const dispatch = useDispatch();
  const getStops = useCallback(() => {
    dispatch(fetchStops());
  }, [dispatch]);

  //  ==== очищаем ошибки и получаем все остановки через redux ==== //
  useEffect(() => {
    getStops();
  }, [getStops]);

  return (
    <>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/trips" component={TripsPage} />
          <Route path="/order" component={OrderPage} />
          <Route path="/ticket/:id" component={TicketPage} />
          <Route path="/myTicket/:id" component={MyTicketPage} />
          <Route path="/error" component={ErrorPage} />
        </Switch>
      </div>
    </>
  );
};

export default App;
