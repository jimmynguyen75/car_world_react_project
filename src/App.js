import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.less';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';
import ManagerDashboardComponent from './components/manager/ManagerDashboardComponent';
import NotFound404Component from './components/notFound/NotFound404Component';
import Test from './components/Test';
import AccountService from './services/AccountService';
import './styles/login.css';
import CheckLogin from './components/notFound/CheckLogin';
function App() {

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
    <WebRouter />
  );
}

export default App;
