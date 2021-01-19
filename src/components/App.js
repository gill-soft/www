import React, {useEffect} from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import OrderPage from "../pages/OrderPage";
import TripsPage from "../pages/TripsPage";
import { fetchStops } from "../redux/searchForm/searchFormOperation";


const App = ({fetchStops}) => {

   //  ==== получаем все остановки через redux ==== //
   useEffect(() => {
    fetchStops();
  }, [fetchStops]);

  return (
    <div>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/order" component={OrderPage} />
        <Route path="/trips" component={TripsPage} />
      </Switch>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchStops: () => dispatch(fetchStops()),
});

export default connect(null, mapDispatchToProps)(App);
