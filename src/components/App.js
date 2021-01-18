import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "../pages/HomePage";
import OrderPage from "../pages/OrderPage";
import TripsPage from "../pages/TripsPage";

const App = () => {
  return (
    <div>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/order/:params" component={OrderPage} />
        <Route path="/trips" component={TripsPage} />
      </Switch>
    </div>
  );
};

export default App;
