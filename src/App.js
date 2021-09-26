import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.less';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';
import ManagerDashboardComponent from './components/manager/ManagerDashboardComponent';
import NotFound404Component from './components/notFound/NotFound404Component';
import Test from './components/Test';
import AccountService from './services/AccountService';
import './styles/login.css';
import React from 'react';
function App() {
  const role = AccountService.getCurrentUser();

  return (
    <Router>
      <Switch>
        {/* Admin */}
        <Route path="/" exact component={LoginComponent}></Route>
        <Route path="/quan-tri" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/xe" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/tai-khoan" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/phu-kien" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/thong-tin-ca-nhan" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/thuong-hieu" render={() => { return role ? <AdminDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/dang-nhap" exact component={LoginComponent}></Route>
        <Route path="/test" exact component={Test}></Route>

        {/* Manager */}
        <Route path="/quan-ly" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/phan-hoi" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/bai-dang" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/su-kien" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/cuoc-thi" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/tao-bai-dang" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>
        <Route path="/quan-ly/thong-tin-ca-nhan" render={() => { return role ? <ManagerDashboardComponent /> : <Redirect to="/dang-nhap" /> }}></Route>

        {/* Not Found - Must End */}
        <Route path="*" exact component={NotFound404Component}></Route>
      </Switch>
    </Router>
  );
}

export default App;
