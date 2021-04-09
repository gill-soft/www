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
import Footer from "./Footer/Footer";
import Info from "../pages/Info";
import AboutUs from "../pages/AboutUs";
import Cities from "../pages/Cities";
import City from "../pages/City";
import { setIsOpenFrom, setIsOpenTo } from "../redux/searchForm/searchFormAction";

const App = () => {
  // ====redux===//
  const dispatch = useDispatch();
  const changeIsOpenFrom = (bool) => dispatch(setIsOpenFrom(bool));
  const changeIsOpenTo = (bool) => dispatch(setIsOpenTo(bool));
  const getStops = useCallback(() => {
    dispatch(fetchStops());
  }, [dispatch]);

  //  ==== очищаем ошибки и получаем все остановки через redux ==== //
  useEffect(() => {
    getStops();
  }, [getStops]);
  
  //  ==== скрываем выпадающий список автокомплита при щелчке вне инпута === //
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target.id !== "from") changeIsOpenFrom(false);
      if (e.target.id !== "to") changeIsOpenTo(false);
    });
  });

  return (
    <>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/міста/:city" component={City} />
          <Route path="/города/:city" component={City} />
          <Route path="/cities/:city" component={City} />
          <Route path="/miasta/:city" component={City} />
          <Route path="/міста/" component={Cities} />
          <Route path="/города/" component={Cities} />
          <Route path="/cities/" component={Cities} />
          <Route path="/miasta/" component={Cities} />
          <Route path="/info" component={Info} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/trips/:from/:to" component={TripsPage} />
          <Route path="/автобуси/:from/:to" component={TripsPage} />
          <Route path="/автобусы/:from/:to" component={TripsPage} />
          <Route path="/autobusy/:from/:to" component={TripsPage} />
          <Route path="/order" component={OrderPage} />
          <Route path="/ticket/:id/:pay" component={TicketPage} />
          <Route path="/myTicket/:id" component={MyTicketPage} />
          <Route path="/error" component={ErrorPage} />
        </Switch>
        <Footer />
      </div>
    </>
  );
};

export default App;
