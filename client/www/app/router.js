import React from "react";
import {Router,Switch,Route,ConnectedRouter} from "dva/router";
import App from "./containers/App.js";

export default ({history,app})=>{
    return <Router history={history}>
        <Switch>
            <Route exact path="/" component={App}></Route>
        </Switch>
    </Router>

}