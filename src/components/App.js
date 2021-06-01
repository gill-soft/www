import React, { useEffect, useCallback, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import LinearProgress from '@material-ui/core/LinearProgress';
import { changeLanguage } from "../redux/Language/LanguageAction";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const MyTicketPage = lazy(() => import("../pages/MyTicketPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const TicketPage = lazy(() => import("../pages/TicketPage"));
const TripsPage = lazy(() => import("../pages/TripsPage"));
const Info = lazy(() => import("../pages/Info"));
const City = lazy(() => import("../pages/City"));
const Cities = lazy(() => import("../pages/Cities"));

const App = () => {
  const dispatch = useDispatch();

  const setLanguege = useCallback(
    (lang) => {
      dispatch(changeLanguage(lang));
    },
    [dispatch]
  );
  useEffect(() => {
    const lang = JSON.parse(localStorage.getItem("language")) || "UA";
    setLanguege(lang);
  }, [setLanguege]);

  return (
    <Suspense fallback={<LinearProgress />} >
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
        <Route path="/order" component={OrderPage} />
        <Route path="/ticket/:orderId/:primary/:secondary" component={TicketPage} />
        <Route path="/myTicket/:orderId/:payedId" component={MyTicketPage} />
        <Route path="/error" component={ErrorPage} />
      </Switch>
      <Footer />
    </Suspense>
  );
};

export default App;
