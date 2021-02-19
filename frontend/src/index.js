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
          <Route path="/">
            <comp.LoginView />
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
