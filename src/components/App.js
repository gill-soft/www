import React, { useEffect, useCallback, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import { changeLanguage } from "../redux/Language/LanguageAction";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { getWalletInfo } from "../redux/order/orderOperation";
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const MyTicketPage = lazy(() => import("../pages/MyTicketPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const TicketPage = lazy(() => import("../pages/TicketPage"));
const TripsPage = lazy(() => import("../pages/TripsPage"));
const Info = lazy(() => import("../pages/Info"));
const City = lazy(() => import("../pages/City"));
const Cities = lazy(() => import("../pages/Cities"));
const AgentPage = lazy(() => import("../pages/AgentPage"));
const ViewTicket = lazy(() => import("../pages/ViewTicket"));
const Authorization = lazy(() => import("../pages/Authorization"));
const Cabinet = lazy(() => import("../pages/CabinetPage"));

const App = () => {
  const dispatch = useDispatch();

  const setLanguege = useCallback(
    (lang) => {
      dispatch(changeLanguage(lang));
    },
    [dispatch]
  );
  const getWallet = useCallback(() => {
    dispatch(getWalletInfo());
  }, [dispatch]);
  useEffect(() => {
    const lang = JSON.parse(localStorage.getItem("language")) || "UA";
    setLanguege(lang);
    getWallet();
  }, [setLanguege, getWallet]);

  return (
    <>
      <Header />
      <Suspense fallback={<LinearProgress />}>
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
          <Route path="/ticket/:orderId" component={TicketPage} />
          <Route path="/myTicket/:orderId/:payedId" component={MyTicketPage} />
          <Route path="/agent" component={AgentPage} />
          <Route path="/viewTicket/:orderId" component={ViewTicket} />
          <Route path="/error" component={ErrorPage} />
          <Route path="/authorization" component={Authorization} />
          <Route path="/cabinet" component={Cabinet} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
      <Footer />
    </>
  );
};

export default App;
