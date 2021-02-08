import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./stylesheet/main.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import App from "./components/App";

ReactDOM.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <HashRouter>
      <Provider store={store}>
        <Route component={App} />
      </Provider>
    </HashRouter>
    {/* </BrowserRouter> */}
  </React.StrictMode>,
  document.getElementById("trips")
);
// const title = document.querySelector(".title");
// window.onhashchange = () => {
//   title.classList.add("disabled");
// }
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
