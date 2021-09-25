import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.less';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';
import ManagerDashboardComponent from './components/manager/ManagerDashboardComponent';
import NotFound404Component from './components/notFound/NotFound404Component';
import Test from './components/Test';
// import AccountService from './services/AccountService';
import './styles/login.css';
function App() {
  //const currentUser = AccountService.getCurrentUser();
  // const admin = currentUser.RoleId == 1; // do later
  // const manager = currentUser.RoleId == 2;
  return (
    <Router>
      <Switch>
        {/* Admin */}
        <Route path="/" exact component={AdminDashboardComponent} title="Admin Dashboard"></Route>
        <Route path="/quan-tri" render={() => { return localStorage.getItem('user') ? <AdminDashboardComponent /> : <Redirect to="/login" /> }}></Route>
        <Route path="/quan-ly/xe" exact component={AdminDashboardComponent}></Route>
        <Route path="/quan-ly/tai-khoan" exact component={AdminDashboardComponent}></Route>
        <Route path="/quan-ly/phu-kien" exact component={AdminDashboardComponent}></Route>
        <Route path="/thong-tin-ca-nhan" exact component={AdminDashboardComponent}></Route>
        <Route path="/login" exact component={LoginComponent}></Route>
        <Route path="/test" exact component={Test}></Route>

        {/* Manager */}
        <Route path="/quan-ly" render={() => { return localStorage.getItem('user') ? <ManagerDashboardComponent /> : <Redirect to="/login" /> }}></Route>
        <Route path="/quan-ly/phan-hoi" component={ManagerDashboardComponent}></Route>
        <Route path="/quan-ly/bai-dang" component={ManagerDashboardComponent}></Route>
        <Route path="/quan-ly/su-kien" component={ManagerDashboardComponent}></Route>
        <Route path="/quan-ly/cuoc-thi" component={ManagerDashboardComponent}></Route>
        <Route path="/quan-ly/tao-bai-dang" component={ManagerDashboardComponent}></Route>

        {/* Not Found - Must End */}
        <Route path="*" exact component={NotFound404Component}></Route>
      </Switch>
    </Router>
  );
}

export default App;
