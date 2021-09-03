import './App.less';
import './styles/login.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';
import ManagerDashboardComponent from './components/ManagerDashboardComponent';

import {Button } from 'antd';

function App() {
  

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AdminDashboardComponent} title="Admin Dashboard"></Route>
        <Route path="/admin" exact component={AdminDashboardComponent} title="Admin Dashboard"></Route>
        <Route path="/manage" exact component={ManagerDashboardComponent} title="Manage Dashboard"></Route>
        <Route path="/manage/cars" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/feedback" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/accounts" exact component={AdminDashboardComponent}></Route>
        <Route path="/profile" exact component={AdminDashboardComponent}></Route>
        <Route path="/login" exact component={LoginComponent}></Route>
      </Switch>
    </Router>
  );
}

export default App;
