import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./stylesheet/main.css";

import SearchForm from "./components/SearchForm/SearchForm";
import store from "./redux/store";
import { Provider } from "react-redux";
import LanguageSelect from "./components/Language/LanguageSelect";
import TripsContainer from "./components/TripsContainer/TripsContainer";
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

// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <TripsContainer />
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById("tripsContainer")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
