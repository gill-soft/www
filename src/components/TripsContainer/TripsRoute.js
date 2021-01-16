import React from 'react';
import { Switch, Route } from "react-router-dom";
import TripsContainer from './TripsContainer';
import TripsInfo from './TripsInfo';


const TripsRoute = () => {
    return (
        <div>
            <Switch>
                <Route path="/" exact component={TripsContainer} />
                {/* <Route path="/info"  component={TripsInfo} /> */}
            </Switch>
            
        </div>
    );
};

export default TripsRoute;