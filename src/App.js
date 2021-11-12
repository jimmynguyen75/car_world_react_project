//noti
import React, { useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.less';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';
import ManagerDashboardComponent from './components/manager/ManagerDashboardComponent';
import CheckLogin from './components/notFound/CheckLogin';
import NotFound404Component from './components/notFound/NotFound404Component';
import ReactNotificationComponent from './components/ReactNotificationComponent';
import Test from './components/Test';
import AccountService from './services/AccountService';
import { onMessageListener } from './services/ImageFirebase';
import './styles/login.css';
function App() {
  //start
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" })
  console.log("show:", show)
  console.log("notification:", notification)
  onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));
  //end
  const role = AccountService.getCurrentUser()
  const WebRouter = () => {
    if (role) {
      if (role.RoleId === 1) {
        return (
          <Router>
            <Switch>
              {/* Admin */}
              <Route path="/" exact component={AdminDashboardComponent}></Route>
              <Route path="/xe" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/tai-khoan" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/phu-kien" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/thong-tin-ca-nhan" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/thuong-hieu" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/test" exact component={Test}></Route>
              {/* Not Found - Must End */}
              <Route path="*" exact component={NotFound404Component}></Route>
            </Switch>
          </Router>
        )
      } if (role.RoleId === 2) {
        return (
          <Router>
            <Switch>
              {/* Manager */}
              <Route path="/" exact component={ManagerDashboardComponent}></Route>
              <Route path="/:title" exact component={ManagerDashboardComponent}></Route>
              <Route path="/de-xuat" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/phan-hoi" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/bai-dang" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/su-kien" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/cuoc-thi" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/giai-thuong" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/tao-bai-dang" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/sua-bai-dang" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/thong-tin-ca-nhan" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/" /> }}></Route>
              <Route path="/test" exact component={Test}></Route>
              {/* Not Found - Must End */}
              <Route path="*" exact component={NotFound404Component}></Route>
            </Switch>
          </Router>
        )
      }
      <Route path="*" exact component={NotFound404Component}></Route>
    } else {
      return (
        <Router>
          <Switch>
            <Route path="/" exact component={LoginComponent}></Route>
            <Route path="*" exact component={CheckLogin}></Route>
          </Switch>
        </Router>
      )
    }
  }
  return (
    <>
      <WebRouter />
      {show ? (<ReactNotificationComponent title={notification.title} body={notification.body} />) : (<></>)}
      {/* <Test /> */}
      {/* <Fader text="Hellu"></Fader> */}
    </>
  );
}

export default App;
