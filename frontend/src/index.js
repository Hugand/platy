import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import * as comp from './components/index'

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
          <Route path="/signin" exact={true}>
            <comp.LoginView />
          </Route>
          <Route exact path="/">
            <comp.MainView contentComponent={<comp.HomeView/>}/>
          </Route>
          <Route path="/search">
            <comp.MainView contentComponent={<comp.SearchView/>}/>
          </Route>
          <Route path="/friend_requests">
            <comp.MainView contentComponent={<comp.FriendRequestsView/>}/>
          </Route>
          <Route path="/profile">
            <comp.MainView contentComponent={<comp.UserProfileViewfrom/>}/>
          </Route>
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
