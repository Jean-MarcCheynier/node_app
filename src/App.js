import React, { Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from "history";

import GuardedRoute from './app/utils/GuardedRoute';
import { onUserSignedIn, clearForm } from './features/signin/signinSlice';

import './App.scss';
import AppNavbar from './features/navigation/AppNavbar';
import AppLoader from './features/navigation/AppLoader';

const Home = lazy(() => import('./features/home/Home'));
const Demo = lazy(() => import('./features/demo/Demo'));
const Signin = lazy(() => import('./features/signin/Signin'));
const Signup = lazy(() => import('./features/signup/Signup'));
const Dashboard = lazy(() => import('./features/admin/Dashboard'));
const Profile = lazy(() => import('./features/profile/Profile'));

const customHistory = createBrowserHistory();

const App = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.signin.user); 
  const userInSession = sessionStorage.getItem("user");
  if(!user && userInSession){
    try{
      const _user = JSON.parse(userInSession);
      dispatch(onUserSignedIn(_user));
      dispatch(clearForm())
    } catch (error) { 
      console.error(error);
    }
  }


  return (
      <Router history={customHistory}>
        <>
        { user && <AppNavbar />}
        <div className="container-fluid">
          <Suspense fallback={<AppLoader/>}>
            <Switch>
              <GuardedRoute exact path="/home" component={Home} meta={{auth: true, redirect: "/signin"}} />
              <GuardedRoute exact path="/demo" component={Demo} meta={{auth: true, redirect: "/signin"}} />
              <GuardedRoute path="/admin" component={Dashboard} meta={{auth: true, redirect: "/home", roles: ['admin']}} />
              <GuardedRoute path="/profile" component={Profile} meta={{auth: true, redirect: "/home"}} />
              <Route exact path={["/signin","/signin/as/:login?"]} component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <Route path="*"><Redirect to="/home"/></Route>
            </Switch>
          </Suspense>
        </div>
        </>
      </Router>


  )
}

export default App;
