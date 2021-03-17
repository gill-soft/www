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
import Footer from './Footer/Footer'

// const MyTicketPage = lazy(() => import("../pages/MyTicketPage"));
// const OrderPage = lazy(() => import("../pages/OrderPage"));
// const TicketPage = lazy(() => import("../pages/TicketPage"));
// const TripsPage = lazy(() => import("../pages/TripsPage"));

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
          <Route path="/trips/:from/:to" component={TripsPage} />
          <Route path="/автобуси/:from/:to" component={TripsPage} />
          <Route path="/автобусы/:from/:to" component={TripsPage} />
          <Route path="/autobusy/:from/:to" component={TripsPage} />
          <Route path="/order" component={OrderPage} />
          <Route path="/ticket/:id/:pay" component={TicketPage} />
          <Route path="/myTicket/:id" component={MyTicketPage} />
          <Route path="/error" component={ErrorPage} />
        </Switch>
        <Footer></Footer>
      </div>
    </>
  );
};

export default App;
