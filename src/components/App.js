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
import { changeLanguage } from "../redux/Language/LanguageAction";

const App = () => {
  const dispatch = useDispatch();

  const getStops = useCallback(() => {
    dispatch(fetchStops());
  }, [dispatch]);
  const setLanguege = useCallback(
    (lang) => {
      dispatch(changeLanguage(lang));
    },
    [dispatch]
  );

  //  ==== очищаем ошибки и получаем все остановки через redux ==== //
  useEffect(() => {
    getStops();
  }, [getStops]);

  useEffect(() => {
    const lang = JSON.parse(localStorage.getItem("language")) || "UA";
    setLanguege(lang);
  }, [setLanguege]);

  return (
    <>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/автобуси/:from/:to" component={TripsPage} />
          <Route path="/автобусы/:from/:to" component={TripsPage} />
          <Route path="/trips/:from/:to" component={TripsPage} />
          <Route path="/autobusy/:from/:to" component={TripsPage} />
          <Route path="/автобуси/:city" component={City} />
          <Route path="/автобусы/:city" component={City} />
          <Route path="/trips/:city" component={City} />
          <Route path="/autobusy/:city" component={City} />
          <Route path="/автобуси/" component={Cities} />
          <Route path="/автобусы/" component={Cities} />
          <Route path="/trips/" component={Cities} />
          <Route path="/autobusy/" component={Cities} />
          <Route path="/info" component={Info} />
          <Route path="/about-us" component={AboutUs} />
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
