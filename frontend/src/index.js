import React from 'react';
import ReactDOM from 'react-dom';
import '@styles/index.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { initialState, reducer } from './globalState'
import { StateProvider } from './state'
import { LoginView } from '@views/loginView'
import { MainView } from '@views/mainView'
import { FriendRequestsView } from '@views/friendRequests'
import { UserProfileView } from '@views/userProfileView'
import { HomeView } from '@views/homeView'

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Router>
          <Switch>
            <Route path="/signin" exact={true}>
              <LoginView />
            </Route>
            <Route exact path="/">
              <MainView contentComponent={<HomeView/>}/>
            </Route>
            <Route path="/search">
              <MainView contentComponent={<SearchView/>}/>
            </Route>
            <Route path="/friend_requests">
              <MainView contentComponent={<FriendRequestsView/>}/>
            </Route>
            <Route path="/profile">
              <MainView contentComponent={<UserProfileView/>}/>
            </Route>
          </Switch>
      </Router>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
