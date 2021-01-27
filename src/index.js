import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./stylesheet/main.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import LanguageSelect from "./components/Language/LanguageSelect";
import App from './components/App'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageSelect />
    </Provider>
  </React.StrictMode>,
  document.getElementById("language")
);

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


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
