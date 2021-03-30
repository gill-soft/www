import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter,  Route } from "react-router-dom";
import "./stylesheet/main.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import App from "./components/App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Route component={App} />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("trips")
);


