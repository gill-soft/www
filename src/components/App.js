import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Order from "../pages/Order";
import SearchForm from "./SearchForm/SearchForm";

const App = () => {
  return (
    <div>
      {/* <SearchForm /> */}

      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path='/order' component={Order} />
      </Switch>
    </div>
  );
};

export default App;
