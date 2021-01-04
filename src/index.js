import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import "./styles.css";

import SearchForm from "./components/SearchForm/SearchForm";
import store from "./redux/store";
import { Provider } from "react-redux";
import LanguageSelect from "./components/Language/LanguageSelect";

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
    <Provider store={store}>
      <SearchForm />
    </Provider>
  </React.StrictMode>,
  document.getElementById("searchForm")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
